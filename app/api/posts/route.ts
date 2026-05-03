import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { apiRatelimit } from "@/lib/ratelimit";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // ✅ Rate limit
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    const { success } = await apiRatelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { message: "Too many requests. Slow down!" },
        { status: 429 }
      );
    }

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, coverImage } = body;

    if (!title || !content) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        coverImage: coverImage || null,
        authorId: decoded.userId,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // ✅ Rate limit
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    const { success } = await apiRatelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { message: "Too many requests. Slow down!" },
        { status: 429 }
      );
    }

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch posts" }, { status: 500 });
  }
}