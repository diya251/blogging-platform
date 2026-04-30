import { PrismaClient } from "@prisma/client";
import EditPostForm from "./EditPostForm";

const prisma = new PrismaClient();

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <EditPostForm post={post} />
    </div>
  );
}