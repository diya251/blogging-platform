"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchPosts = async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-8 h-[60px] flex items-center justify-between">
        <h1 className="font-serif text-[22px] font-semibold tracking-tight text-stone-900">
          Write<span className="text-stone-400">Flow</span>
        </h1>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <a
                href="/create-post"
                className="text-[13px] font-medium bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors"
              >
                + New Post
              </a>
              <a
                href="/dashboard"
                className="text-[13px] font-medium border border-stone-300 text-stone-700 px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors"
              >
                Dashboard
              </a>
              <button
                onClick={handleLogout}
                className="text-[13px] text-stone-400 hover:text-stone-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="text-[13px] font-medium border border-stone-300 text-stone-700 px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors"
              >
                Login
              </a>
              <a
                href="/register"
                className="text-[13px] font-medium bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors"
              >
                Register
              </a>
            </>
          )}
        </div>
      </header>

      {/* Section label */}
      <p className="text-center pt-8 pb-2 text-[11px] font-medium tracking-[2px] uppercase text-stone-400">
        Latest stories
      </p>

      {/* Feed */}
      <div className="max-w-2xl mx-auto px-6 pb-12 space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-400 text-sm">
              No posts yet — write your first one.
            </p>
            <a
              href="/create-post"
              className="mt-4 inline-block text-[13px] font-medium border border-stone-300 rounded-lg px-4 py-2 text-stone-700 hover:bg-stone-100 transition-colors"
            >
              Start writing →
            </a>
          </div>
        ) : (
          posts.map((post: any) => (
            <article
              key={post.id}
              className="bg-white border border-stone-200 rounded-xl p-6 hover:border-stone-300 transition-colors group"
            >
              {post.tag && (
                <p className="text-[11px] font-medium tracking-[1.5px] uppercase text-stone-400 mb-2">
                  {post.tag}
                </p>
              )}

              <h2 className="font-serif text-[20px] font-semibold text-stone-900 leading-snug mb-2">
                {post.title}
              </h2>

              <p className="text-[14px] text-stone-500 leading-relaxed mb-4 line-clamp-2">
                {post.content}
              </p>

              <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                {/* Author */}
                <div className="flex items-center gap-2 text-[13px] text-stone-500">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-[10px] font-medium flex items-center justify-center">
                    {post.author?.name?.[0] ?? "U"}
                  </span>
                  {post.author?.name || "Anonymous"}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-stone-400">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <a
                    href={`/posts/${post.id}`}
                    className="text-[12px] font-medium border border-stone-200 rounded-md px-3 py-1 text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    Read →
                  </a>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
