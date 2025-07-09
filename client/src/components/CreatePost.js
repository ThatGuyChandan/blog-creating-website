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
  // Remove AI title suggestion state and logic

  // --- AI Summary Suggestion State ---
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [suggestedSummary, setSuggestedSummary] = useState("");

  // --- AI Title Suggestion State ---
  const [titleLoading, setTitleLoading] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [suggestedTitle, setSuggestedTitle] = useState("");

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

  async function handleSuggestSummary() {
    setSummaryLoading(true);
    setSummaryError("");
    setSuggestedSummary("");
    try {
      const response = await fetch(`${API_URL}/ai/suggest-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        setSummaryError(data.error || "Failed to get summary suggestion.");
      } else {
        setSuggestedSummary(data.summary);
      }
    } catch (err) {
      setSummaryError("Network error. Please try again.");
    } finally {
      setSummaryLoading(false);
    }
  }

  async function handleSuggestTitle() {
    setTitleLoading(true);
    setTitleError("");
    setSuggestedTitle("");
    try {
      const response = await fetch(`${API_URL}/ai/suggest-title`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        setTitleError(data.error || "Failed to get title suggestion.");
      } else {
        setSuggestedTitle(data.title);
      }
    } catch (err) {
      setTitleError("Network error. Please try again.");
    } finally {
      setTitleLoading(false);
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
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
          />
        </div>
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
        <label className="block font-medium text-gray-700 mb-1">
          Content <span className="text-red-600">*</span>
        </label>
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
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={handleSuggestSummary}
            disabled={summaryLoading || !content || content.length < 20}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
            title="Suggest a summary based on your content"
          >
            {summaryLoading ? "Suggesting..." : "Suggest Summary"}
          </button>
          <button
            type="button"
            onClick={handleSuggestTitle}
            disabled={titleLoading || !content || content.length < 20}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
            title="Suggest a title based on your content"
          >
            {titleLoading ? "Suggesting..." : "Suggest Title"}
          </button>
        </div>
        {summaryError && <div className="text-red-500 text-sm mb-2">{summaryError}</div>}
        {suggestedSummary && (
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded p-2 mb-2 mt-2">
            <span className="text-indigo-700 font-medium">AI Summary:</span>
            <span className="italic text-gray-700">{suggestedSummary}</span>
            <button
              type="button"
              onClick={() => setSummary(suggestedSummary)}
              className="ml-2 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold"
            >
              Accept
            </button>
          </div>
        )}
        {titleError && <div className="text-red-500 text-sm mb-2">{titleError}</div>}
        {suggestedTitle && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded p-2 mb-2 mt-2">
            <span className="text-blue-700 font-medium">AI Title:</span>
            <span className="italic text-gray-700">{suggestedTitle}</span>
            <button
              type="button"
              onClick={() => setTitle(suggestedTitle)}
              className="ml-2 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold"
            >
              Accept
            </button>
          </div>
        )}
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
