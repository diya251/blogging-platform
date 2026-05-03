import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { apiRatelimit } from "@/lib/ratelimit";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = await apiRatelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ message: "Too many requests." }, { status: 429 });
  }

  const { id } = await params;
  const { title, content } = await req.json();

  const post = await prisma.post.update({
    where: { id },
    data: { title, content },
  });

  return NextResponse.json(post);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = await apiRatelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ message: "Too many requests." }, { status: 429 });
  }

  const { id } = await params;

  await prisma.post.delete({ where: { id } });

  return NextResponse.json({ message: "Post deleted" });
}