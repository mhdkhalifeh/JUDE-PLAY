import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import JSZip from 'jszip';
import { randomUUID } from 'node:crypto';

export const runtime = 'nodejs';
export const maxDuration = 60;
const MAX_ZIP = 4 * 1024 * 1024;
const MAX_FILE = 12 * 1024 * 1024;
const MAX_TOTAL = 64 * 1024 * 1024;
const types: Record<string, string> = {
  html:'text/html; charset=utf-8', js:'application/javascript; charset=utf-8',
  mjs:'application/javascript; charset=utf-8', css:'text/css; charset=utf-8',
  json:'application/json; charset=utf-8', png:'image/png', jpg:'image/jpeg',
  jpeg:'image/jpeg', webp:'image/webp', avif:'image/avif', gif:'image/gif',
  svg:'image/svg+xml', ico:'image/x-icon', wav:'audio/wav', mp3:'audio/mpeg',
  ogg:'audio/ogg', m4a:'audio/mp4', mp4:'video/mp4', webm:'video/webm',
  woff:'font/woff', woff2:'font/woff2', ttf:'font/ttf', wasm:'application/wasm',
  txt:'text/plain; charset=utf-8', map:'application/json', bin:'application/octet-stream',
};
function safePath(value: string) {
  return value.length <= 500 && !/[\\\x00-\x1f?#%:]/.test(value) &&
    !value.startsWith('/') && value.split('/').every(p => p && p !== '.' && p !== '..' && !p.startsWith('.'));
}

type ZipStream = {
  on(
    event: "data",
    callback: (chunk: Uint8Array) => void
  ): ZipStream;
  on(
    event: "error",
    callback: (error: Error) => void
  ): ZipStream;
  on(
    event: "end",
    callback: () => void
  ): ZipStream;
  pause(): ZipStream;
  resume(): ZipStream;
};

function readBounded(
  entry: JSZip.JSZipObject,
  limit: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    let size = 0;
    let failed = false;

    const stream = (
      entry as unknown as {
        internalStream: (type: "uint8array") => ZipStream;
      }
    ).internalStream("uint8array");

    stream.on("data", (chunk: Uint8Array) => {
      if (failed) return;

      size += chunk.length;

      if (size > limit) {
        failed = true;
        stream.pause();
        reject(
          new Error("ZIP contents exceed the allowed size.")
        );
        return;
      }

      chunks.push(chunk);
    });

    stream.on("error", (error: Error) => {
      if (failed) return;
      failed = true;
      reject(error);
    });

    stream.on("end", () => {
      if (!failed) {
        resolve(Buffer.concat(chunks, size));
      }
    });

    stream.resume();
  });
}

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({error:'Server storage configuration is missing.'}, {status:500});
  const admin = createClient(url, key, {auth:{persistSession:false, autoRefreshToken:false}});
  const token = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return NextResponse.json({error:'Please log in again.'}, {status:401});
  const {data:{user}, error:authError} = await admin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({error:'Your login has expired.'}, {status:401});
  if (user.email?.toLowerCase() !== 'mhd.khalifeh89@gmail.com')
    return NextResponse.json({error:'Admin access required.'}, {status:403});

  let uploaded: string[] = [];
  try {
    const form = await request.formData();
    const file = form.get('file');
    const slug = String(form.get('slug') || '').trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100)
      return NextResponse.json({error:'Use a lowercase slug such as judoku.'}, {status:400});
    if (!(file instanceof File) || !file.name.toLowerCase().endsWith('.zip'))
      return NextResponse.json({error:'Choose a ZIP file.'}, {status:400});
    if (!file.size || file.size > MAX_ZIP)
      return NextResponse.json({error:'ZIP must be smaller than 4 MB. Use the optimized web version.'}, {status:413});
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const entries = Object.values(zip.files).filter(e => !e.dir && !e.name.startsWith('__MACOSX/') && !e.name.endsWith('/.DS_Store'));
    if (!entries.length || entries.length > 500) throw new Error('ZIP must contain between 1 and 500 files.');
    for (const entry of entries) {
      if (!safePath(entry.unsafeOriginalName || entry.name)) throw new Error('ZIP contains an unsafe file path.');
    }
    const indexes = entries.filter(e => e.name.endsWith('/index.html') || e.name === 'index.html');
    const index = indexes.find(e => e.name === 'index.html') || indexes.sort((a,b) => a.name.split('/').length - b.name.split('/').length)[0];
    if (!index) throw new Error('ZIP must contain index.html.');
    const root = index.name.slice(0, -'index.html'.length);
    const selected = entries.filter(e => e.name.startsWith(root));
    // Validate and decompress every file before changing storage.
    const files: {path:string; bytes:Buffer; contentType:string}[] = [];
    let total = 0;
    for (const entry of selected) {
      const path = entry.name.slice(root.length);
      if (!safePath(path)) throw new Error('Invalid game file path.');
      const extension = path.split('.').pop()?.toLowerCase() || '';
      if (!types[extension]) throw new Error(`Unsupported game file type: ${extension}`);
      const bytes = await readBounded(entry, Math.min(MAX_FILE, MAX_TOTAL - total));
      total += bytes.length;
      files.push({path, bytes, contentType:types[extension]});
    }
    // Unique releases keep a failed update from replacing the current working game.
    const prefix = `${slug}/releases/${randomUUID()}`;
    files.sort((a,b) => Number(a.path === 'index.html') - Number(b.path === 'index.html'));
    for (let i = 0; i < files.length; i += 4) {
      const results = await Promise.all(files.slice(i, i + 4).map(async item => {
        const path = `${prefix}/${item.path}`;
        const {error} = await admin.storage.from('game-files').upload(path, item.bytes, {
          contentType:item.contentType, cacheControl:'31536000', upsert:false,
        });
        if (!error) uploaded.push(path);
        return error;
      }));
      if (results.some(Boolean)) throw new Error('Could not store the game files. Check the game-files bucket and its file-type limits.');
    }
    const gameUrl = '/api/play/' + prefix.split('/').map(encodeURIComponent).join('/') + '/index.html';
    return NextResponse.json({success:true, gameUrl, files:files.length});
  } catch (error) {
    if (uploaded.length) await admin.storage.from('game-files').remove(uploaded);
    return NextResponse.json({error:error instanceof Error ? error.message : 'Game upload failed.'}, {status:400});
  }
}
