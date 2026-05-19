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
  if (filePath.endsWith(".jpg")) return "image/jpeg";
  if (filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".svg")) return "image/svg+xml";

  return "application/octet-stream";
}

export async function GET(request, { params }) {
  const { slug, path } = params;

  const filePath = path.join("/");
  const storagePath = `${slug}/${filePath}`;

  const { data, error } = await supabaseAdmin.storage
    .from("game-files")
    .download(storagePath);

  if (error || !data) {
    return new NextResponse("File not found", {
      status: 404,
    });
  }

  return new NextResponse(data, {
    headers: {
      "Content-Type": getContentType(filePath),
      "Cache-Control": "public, max-age=31536000",
    },
  });
}