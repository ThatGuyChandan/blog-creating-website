import React, { useContext, useState, useRef } from "react";
import { Link, useNavigate, Routes, Route } from "react-router-dom";
import { UserContext, UserContextProvider } from "./components/UserContext";
import Post from "./components/Post";
import Login from "./components/Login";
import Register from "./components/Register";
import CreatePost from "./components/CreatePost";
import MainContent from "./components/MainContent";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import MyBlog from "./components/MyBlog";

function Navbar() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  function handleLogout() {
    fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setUserInfo({});
      setDropdownOpen(false);
      navigate("/");
    });
  }

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600 tracking-tight">BlogWeb</div>
      <div className="space-x-4 flex items-center">
        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">Home</Link>
        {userInfo && userInfo.username && (
          <Link to="/create" className="text-gray-700 hover:text-blue-600 font-medium transition">Create</Link>
        )}
        {!userInfo.username && (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium transition">Register</Link>
          </>
        )}
        {userInfo && userInfo.username && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-blue-50 transition focus:outline-none"
            >
              <span className="font-semibold text-gray-700">{userInfo.username}</span>
              <span className="inline-block w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
                </svg>
              </span>
              <span className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50 animate-fade-in">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/my-blog"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Blog
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-blue-50 rounded-b-lg transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <UserContextProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full py-10 px-4">
          <Routes>
            <Route index element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<MainContent />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-blog" element={<MyBlog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} BlogWeb. All rights reserved.
        </footer>
      </div>
    </UserContextProvider>
  );
}

export default App;
