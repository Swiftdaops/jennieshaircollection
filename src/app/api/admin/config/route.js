export async function GET() {
  const adminName = process.env.NEXT_ADMIN_NAME || process.env.NEXT_PUBLIC_ADMIN_NAME || "Admin";
  return new Response(JSON.stringify({ adminName }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
