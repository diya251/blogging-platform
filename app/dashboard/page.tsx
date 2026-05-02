"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setAuthorized(true);
      fetchPosts();
    }
    setLoading(false);
  }, []);

  async function fetchPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  }

  async function handleDelete(id: string) {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Delete this post?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await fetch(`/api/posts/${id}`, { method: "DELETE" });
                setPosts((prev) => prev.filter((p) => p.id !== id));
                toast.success("Post deleted");
              }}
              className="bg-red-600 text-white text-xs px-3 py-1 rounded-lg"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  }

  function handleLogout() {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    router.replace("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold tracking-tight">📝 My Blog</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/create-post")}
            className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            + New Post
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Posts</h2>
          <span className="text-sm text-gray-400">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border shadow-sm">
            <div className="text-5xl mb-4">🖊️</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              No posts yet
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Start writing your first blog post!
            </p>
            <button
              onClick={() => router.push("/create-post")}
              className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition text-sm"
            >
              + Create First Post
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
              >
                {/* Cover Image */}
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-40 object-cover"
                  />
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap mt-1">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <span className="text-xs text-gray-400">
                      By {post.author?.name || "Unknown"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/posts/${post.id}`)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/posts/${post.id}/edit`)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}