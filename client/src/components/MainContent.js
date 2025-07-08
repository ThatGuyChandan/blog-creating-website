import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "./UserContext";

function ConfirmModal({ open, onConfirm, onCancel, message }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <div className="text-lg font-semibold mb-4 text-gray-800">{message}</div>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
            onClick={onConfirm}
          >
            Delete
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-semibold"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function MainContent() {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetch(`${API_URL}/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, [id, API_URL]);
  if (!postInfo) {
    return "";
  }
  async function handleDelete() {
    await fetch(`${API_URL}/post/${postInfo._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    navigate("/");
  }
  return (
    <main className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 mb-10">
      <ConfirmModal
        open={showConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        message="Are you sure you want to delete this post?"
      />
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-800 leading-tight">{postInfo.title}</h1>
      <div className="flex items-center text-sm text-gray-500 mb-4 space-x-2">
        <span className="font-medium">By {postInfo.author.username}</span>
        <span>&bull;</span>
        <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
        {userInfo && userInfo.id === postInfo.author._id && (
          <div className="ml-auto flex gap-2">
            <Link className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs font-semibold" to={`/edit/${postInfo._id}`}>Edit</Link>
            <button
              onClick={() => setShowConfirm(true)}
              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs font-semibold"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="w-full flex justify-center mb-8">
        <img
          src={postInfo.cover && (postInfo.cover.startsWith('http') ? postInfo.cover : `${API_URL}/${postInfo.cover}`)}
          alt="Not found"
          className="rounded-lg shadow max-h-96 object-contain w-full"
        />
      </div>
      <div className="prose prose-lg max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
    </main>
  );
}

export default MainContent;
