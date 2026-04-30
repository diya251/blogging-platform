import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return Response.json({ message: "No token" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const user = verifyToken(token);

  if (!user) {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }

  return Response.json({ message: "Access granted", user });
}