import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  async function createNewPost(ev) {
    ev.preventDefault();
    setError("");
    if (!title.trim() || !summary.trim() || !content.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!files || files.length === 0) {
      setError("Please upload an image.");
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    try {
      const response = await fetch(`${API_URL}/post`, {
        method: "POST",
        body: data,
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Failed to create post.");
      } else {
        setRedirect(true);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 mb-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Create a New Post</h2>
      {error && <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>}
      {loading && <div className="mb-4 text-blue-500 text-center">Posting...</div>}
      <form onSubmit={createNewPost} className="space-y-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
        />
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(ev) => setSummary(ev.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
        />
        <label className="block font-medium text-gray-700 mb-1">
          Upload Image <span className="text-red-600">*</span>
        </label>
        <input
          type="file"
          onChange={(ev) => setFiles(ev.target.files)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-white"
        />
        <ReactQuill
          value={content}
          onChange={setContent}
          theme="snow"
          className="bg-white rounded-lg border border-gray-300"
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"]
            ]
          }}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition text-lg disabled:opacity-60"
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
