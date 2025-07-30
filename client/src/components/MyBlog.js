import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import Content from "./Content";

function MyBlog() {
  const { userInfo } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userInfo && userInfo.id) {
      fetch(`${process.env.REACT_APP_API_URL}/post`)
        .then((res) => res.json())
        .then((allPosts) => {
          // Support both paginated and array response
          const postsArr = Array.isArray(allPosts) ? allPosts : allPosts.posts;
          if (!Array.isArray(postsArr)) {
            setPosts([]);
            setLoading(false);
            return;
          }
          const myPosts = postsArr.filter((p) => p.author && p.author._id === userInfo.id);
          setPosts(myPosts);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userInfo]);

  // Add skeleton loader for consistency
  const SKELETON_COUNT = 6;

  if (!userInfo || !userInfo.username) {
    return (
      <div className="text-center text-gray-500 py-20 text-lg">Please log in to view your blog.</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 mb-10">
      <div className="flex items-center gap-4 mb-8">
        <span className="inline-block w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-3xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
          </svg>
        </span>
        <div>
          <div className="text-2xl font-bold text-gray-800">{userInfo.username}</div>
          <div className="text-gray-500 text-sm">My Blog</div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg flex flex-col animate-pulse overflow-hidden w-full h-40 mx-2" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-400 py-10 text-lg">You haven't posted anything yet.</div>
      ) : (
        <div className="grid gap-8 grid-cols-1">
          {posts.map((post) => <Content key={post._id} {...post} />)}
        </div>
      )}
    </div>
  );
}

export default MyBlog; 