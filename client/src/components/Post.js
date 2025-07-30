import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
import Content from "./Content";
import { UserContext } from "./UserContext";
import { io } from "socket.io-client";

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

const SKELETON_COUNT = 6;

function PostSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg flex flex-col animate-pulse overflow-hidden">
      <div className="h-56 bg-gray-200 w-full" />
      <div className="flex-1 flex flex-col p-6">
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="flex items-center space-x-2 mb-2">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-8 bg-gray-200 rounded" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const observer = useRef();
  const { userInfo } = useContext(UserContext);

  const fetchPosts = useCallback(async (pageNum) => {
    setLoading(true);
    const res = await fetch(`${process.env.REACT_APP_API_URL}/post?page=${pageNum}&limit=9`);
    const data = await res.json();
    if (pageNum === 1) {
      setPosts(data.posts);
    } else {
      setPosts((prev) => [...prev, ...data.posts]);
    }
    setTotal(data.total);
    setHasMore(data.posts.length > 0 && posts.length + data.posts.length < data.total);
    setLoading(false);
  }, [posts.length]);

  useEffect(() => {
    fetchPosts(page);
    // eslint-disable-next-line
  }, [page]);

  // Real-time updates with Socket.IO
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });
    socket.on("new_post", (newPost) => {
      setPosts((prev) => {
        if (prev.some((p) => p._id === newPost._id)) return prev;
        return [newPost, ...prev];
      });
      setTotal((t) => t + 1);
    });
    socket.on("edit_post", (updatedPost) => {
      setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
    });
    socket.on("delete_post", (deletedId) => {
      setPosts((prev) => prev.filter((p) => p._id !== deletedId));
      setTotal((t) => (t > 0 ? t - 1 : 0));
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

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
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mr-2">Latest</span>
        <h2 className="text-2xl font-bold text-gray-800">Recent Posts</h2>
      </div>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {posts.length > 0 && posts.map((post, i) => {
          if (i === posts.length - 1) {
            return <div ref={lastPostRef} key={post._id}><Content {...post} /></div>;
          } else {
            return <Content key={post._id} {...post} />;
          }
        })}
        {loading && Array.from({ length: SKELETON_COUNT }).map((_, i) => <PostSkeleton key={i} />)}
      </div>
      {!loading && posts.length === 0 && (
        <div className="text-center text-gray-400 py-20 text-lg">No posts yet. Be the first to share your story!</div>
      )}
      {!hasMore && posts.length > 0 && (
        <div className="text-center text-gray-400 py-8 text-sm">No more posts to load.</div>
      )}
    </>
  );
};

export default Post;
