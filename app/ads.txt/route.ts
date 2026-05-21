export const dynamic = "force-static";

export async function GET() {
  return new Response("", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}