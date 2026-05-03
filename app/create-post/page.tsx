"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { fetchWithAuth } from "@/lib/auth"

export default function CreatePost() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      toast.error("Please login first")
      router.push("/login")
      return
    }

    let coverImage = null

    // Upload image first if one was selected
    if (imageFile) {
      const formData = new FormData()
      formData.append("file", imageFile)

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok) {
        toast.error("Image upload failed")
        setLoading(false)
        return
      }

      coverImage = uploadData.url
    }

    // ✅ Use fetchWithAuth instead of fetch — handles token refresh automatically
    const res = await fetchWithAuth("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, coverImage }),
    })

    const data = await res.json()

    if (!res.ok) {
      if (res.status === 401) {
        toast.error("Session expired, please login again")
        router.push("/login")
        return
      }
      toast.error(data.message || "Something went wrong")
      setLoading(false)
      return
    }

    toast.success("Post published!")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create a New Post</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cover Image Upload */}
          <div
            className="w-full border-2 border-dashed border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:border-gray-400 transition"
            onClick={() => document.getElementById("coverImage")?.click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Cover preview"
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-gray-400 gap-2">
                <span className="text-4xl">🖼️</span>
                <p className="text-sm">Click to add a cover image</p>
              </div>
            )}
          </div>
          <input
            id="coverImage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

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