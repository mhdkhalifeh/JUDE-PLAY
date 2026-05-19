import { NextResponse } from "next/server";
import AdmZip from "adm-zip";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getContentType(fileName: string) {
  if (fileName.endsWith(".html")) return "text/html";
  if (fileName.endsWith(".js")) return "application/javascript";
  if (fileName.endsWith(".css")) return "text/css";
  if (fileName.endsWith(".png")) return "image/png";
  if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return "image/jpeg";
  if (fileName.endsWith(".gif")) return "image/gif";
  if (fileName.endsWith(".svg")) return "image/svg+xml";
  if (fileName.endsWith(".json")) return "application/json";
  if (fileName.endsWith(".mp3")) return "audio/mpeg";
  if (fileName.endsWith(".wav")) return "audio/wav";
  if (fileName.endsWith(".ogg")) return "audio/ogg";
  return "application/octet-stream";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const slug = formData.get("slug") as string | null;

    if (!file || !slug) {
      return NextResponse.json(
        { error: "File and slug are required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();

    const indexEntry = entries.find((entry) =>
      entry.entryName.toLowerCase().endsWith("index.html")
    );

    if (!indexEntry) {
      return NextResponse.json(
        { error: "index.html not found inside ZIP" },
        { status: 400 }
      );
    }

    const rootPrefix = indexEntry.entryName.replace(/index\.html$/i, "");

    for (const entry of entries) {
      if (entry.isDirectory) continue;

      let relativePath = entry.entryName;

      if (rootPrefix && relativePath.startsWith(rootPrefix)) {
        relativePath = relativePath.slice(rootPrefix.length);
      }

      if (!relativePath) continue;

      const fileBuffer = entry.getData();
      const storagePath = `${slug}/${relativePath}`;

      const { error } = await supabaseAdmin.storage
        .from("game-files")
        .upload(storagePath, fileBuffer, {
          upsert: true,
          contentType: getContentType(relativePath),
        });

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
    }

    const { data } = supabaseAdmin.storage
      .from("game-files")
      .getPublicUrl(`${slug}/index.html`);

    return NextResponse.json({
      success: true,
      gameUrl: data.publicUrl,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}