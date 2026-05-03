import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { authRatelimit } from "@/lib/ratelimit";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    const { success } = await authRatelimit.limit(ip);

    if (!success) {
      return Response.json(
        { message: "Too many login attempts. Try again in 15 minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return Response.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ message: "Invalid credentials" }, { status: 400 });
    }

    // ✅ Short-lived access token (15 minutes)
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    // ✅ Long-lived refresh token (7 days)
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    // Save refresh token to DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return Response.json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Error" }, { status: 500 });
  }
}