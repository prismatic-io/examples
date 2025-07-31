import { generateToken } from "@/util/token";

export async function GET(req: Request) {
  const token = generateToken();
  const prismaticUrl = process.env.PRISMATIC_URL || "https://app.prismatic.io";
  return new Response(JSON.stringify({ token, prismaticUrl }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
