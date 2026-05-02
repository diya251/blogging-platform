import { PrismaClient } from "@prisma/client";
import PostActions from "./PostActions";

const prisma = new PrismaClient();

export default async function PostPage({
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
    {/* ✅ Add this */}
    {post.coverImage && (
      <img
        src={post.coverImage}
        alt={post.title}
        className="w-full h-64 object-cover rounded-xl mb-6"
      />
    )}

    <h1 className="text-2xl font-bold">{post.title}</h1>
    <p className="mt-4 text-gray-700">{post.content}</p>
    <PostActions postId={post.id} />
  </div>
)
}