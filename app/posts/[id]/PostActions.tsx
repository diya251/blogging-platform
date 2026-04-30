"use client";

import { useRouter } from "next/navigation";

export default function PostActions({ postId }: { postId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return;

    await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
    });

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex gap-3 mt-6">
      <button
        onClick={() => router.push(`/posts/${postId}/edit`)}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  );
}