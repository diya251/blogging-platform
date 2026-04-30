"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditPost({ params }: any) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/posts`);
      const data = await res.json();

      const post = data.find((p: any) => p.id === params.id);

      if (post) {
        setTitle(post.title);
        setContent(post.content);
      }
    };

    fetchPost();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch(`/api/posts/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      router.push(`/posts/${params.id}`);
    } else {
      alert("Update failed");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-3 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-3 rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          Update Post
        </button>
      </form>
    </div>
  );
}