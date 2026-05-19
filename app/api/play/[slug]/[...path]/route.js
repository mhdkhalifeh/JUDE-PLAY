import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function getContentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html";
  if (filePath.endsWith(".js")) return "application/javascript";
  if (filePath.endsWith(".css")) return "text/css";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".json")) return "application/json";
  if (filePath.endsWith(".mp3")) return "audio/mpeg";
  if (filePath.endsWith(".wav")) return "audio/wav";
  return "application/octet-stream";
}

export async function GET(request, context) {
  const params = await context.params;

  const slug = params.slug;
  const pathArray = params.path || params["...path"] || [];

  const filePath = pathArray.join("/");
  const storagePath = `${slug}/${filePath}`;

  const { data, error } = await supabaseAdmin.storage
    .from("game-files")
    .download(storagePath);

  if (error || !data) {
    return new NextResponse("File not found", { status: 404 });
  }

  return new NextResponse(data, {
    headers: {
      "Content-Type": getContentType(filePath),
      "Cache-Control": "public, max-age=31536000",
    },
  });
}