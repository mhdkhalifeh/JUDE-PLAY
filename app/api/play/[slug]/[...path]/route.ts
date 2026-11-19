import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const types: Record<string,string> = {
  html:'text/html; charset=utf-8', js:'application/javascript; charset=utf-8',
  mjs:'application/javascript; charset=utf-8', css:'text/css; charset=utf-8',
  png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg', webp:'image/webp',
  avif:'image/avif', gif:'image/gif', svg:'image/svg+xml', ico:'image/x-icon',
  json:'application/json', map:'application/json', mp3:'audio/mpeg',
  wav:'audio/wav', ogg:'audio/ogg', m4a:'audio/mp4', mp4:'video/mp4', webm:'video/webm',
  wasm:'application/wasm', woff:'font/woff', woff2:'font/woff2', ttf:'font/ttf', txt:'text/plain; charset=utf-8',
};
type Params = {slug:string; path?:string[]; '...path'?:string[]};
export async function GET(request: Request, context: {params: Promise<Params>}) {
  try {
    const params = await context.params;
    const slug = params.slug;
    const parts = params.path || params['...path'] || [];
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !Array.isArray(parts) ||
        parts.some(p => !p || p === '.' || p === '..' || p.startsWith('.') || /[\\/\x00-\x1f?#%:]/.test(p)))
      return new NextResponse('Invalid path', {status:400});
    if (!parts.length) return NextResponse.redirect(new URL(request.url.replace(/\/?$/, '/index.html')));
    const filePath = parts.join('/');
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return new NextResponse('Storage is not configured', {status:500});
    const admin = createClient(url, key, {auth:{persistSession:false, autoRefreshToken:false}});
    const {data, error} = await admin.storage.from('game-files').download(`${slug}/${filePath}`);
    if (error || !data) return new NextResponse('File not found', {status:404, headers:{'Cache-Control':'no-store'}});
    const extension = filePath.split('.').pop()?.toLowerCase() || '';
    const versioned = parts[0] === 'releases' && parts.length >= 3;
    return new NextResponse(data, {headers:{
      'Content-Type':types[extension] || 'application/octet-stream',
      'Cache-Control':extension === 'html' ? 'no-store' : versioned ? 'public, max-age=31536000, immutable' : 'public, max-age=300',
      'X-Content-Type-Options':'nosniff',
    }});
  } catch {
    return new NextResponse('Unable to load game file', {status:500});
  }
}
