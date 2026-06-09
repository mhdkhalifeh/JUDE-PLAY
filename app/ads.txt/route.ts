export const dynamic = "force-static";

export async function GET() {
  return new Response(
    "google.com, pub-1791515120755145, DIRECT, f08c47fec0942fa0",
    {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}