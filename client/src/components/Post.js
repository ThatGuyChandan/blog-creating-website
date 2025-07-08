import React, { useEffect, useState, useContext } from "react";
import Content from "./Content";
import { UserContext } from "./UserContext";

const HERO_BG = "bg-gradient-to-r from-blue-500 to-indigo-600 text-white";

const features = [
  {
    title: "Create & Share",
    desc: "Write your own stories and share them with the world in seconds.",
    icon: (
      <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
    ),
  },
  {
    title: "Discover",
    desc: "Explore trending posts and find inspiration from others.",
    icon: (
      <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    ),
  },
  {
    title: "No Account Needed",
    desc: "Browse and read posts without logging in. Join to create your own!",
    icon: (
      <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ),
  },
];

const Post = () => {
  const [posts, setPosts] = useState([]);
  const { userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch("http://localhost:4000/post").then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  const loggedIn = !!userInfo && !!userInfo.username;
  return (
    <>
      {/* Hero Section (only if logged out) */}
      {!loggedIn && (
        <section className={`${HERO_BG} rounded-2xl shadow-lg p-10 mb-10 text-center relative overflow-hidden`}> 
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Welcome to BlogWeb</h1>
          <p className="text-lg md:text-2xl font-light mb-6 max-w-2xl mx-auto">Discover, read, and share amazing stories. Join our community or just enjoy the latest posts from everyone!</p>
          <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
            {features.map((f, i) => (
              <div key={f.title} className="flex flex-col items-center bg-white/10 rounded-xl p-6 w-full md:w-72 shadow-md">
                <div className="mb-2">{f.icon}</div>
                <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                <p className="text-blue-100 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a href="/register" className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-100 transition">Join Now</a>
          </div>
          <div className="absolute right-0 top-0 opacity-10 text-9xl select-none pointer-events-none">✍️</div>
        </section>
      )}

      {/* Trending/Latest Section */}
      <div className="flex items-center mb-6">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mr-2">Latest</span>
        <h2 className="text-2xl font-bold text-gray-800">Recent Posts</h2>
      </div>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {posts.length > 0 && posts.map((post) => <Content key={post._id} {...post} />)}
      </div>
      {posts.length === 0 && (
        <div className="text-center text-gray-400 py-20 text-lg">No posts yet. Be the first to share your story!</div>
      )}
    </>
  );
};

export default Post;
