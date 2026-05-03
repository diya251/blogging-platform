import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return Response.json({ message: "No refresh token" }, { status: 401 });
    }

    // Verify the refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      return Response.json({ message: "Invalid refresh token" }, { status: 401 });
    }

    // Check it matches what's in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return Response.json({ message: "Invalid refresh token" }, { status: 401 });
    }

    // ✅ Issue a new access token
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    return Response.json({ accessToken });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}