"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function CreatePost() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Please login first")
      router.push("/login")
      return
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    })

    const data = await res.json()

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("token")
        toast.error("Session expired, please login again")
        router.push("/login")
        return
      }
      toast.error(data.message || "Something went wrong")
      setLoading(false)
      return
    }

    toast.success("Post published!")
    setTitle("")
    setContent("")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create a New Post</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border rounded-lg p-3 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Write your content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  )
}