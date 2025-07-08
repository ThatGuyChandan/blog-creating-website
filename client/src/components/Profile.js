import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";

function Profile() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [step, setStep] = useState("confirm");
  const [currentPassword, setCurrentPassword] = useState("");
  const [editUsername, setEditUsername] = useState(userInfo.username || "");
  const [editPassword, setEditPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!userInfo || !userInfo.username) {
    return (
      <div className="text-center text-gray-500 py-20 text-lg">Please log in to view your profile.</div>
    );
  }

  async function handleConfirmPassword(e) {
    e.preventDefault();
    setMessage("");
    const response = await fetch("http://localhost:4000/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password: currentPassword }),
    });
    if (response.ok) {
      setStep("edit");
      setMessage("");
    } else {
      setMessage("Incorrect password. Please try again.");
    }
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setMessage("");
    const response = await fetch(`http://localhost:4000/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username: editUsername, password: editPassword }),
    });
    if (response.ok) {
      setMessage("Profile updated successfully!");
      setUserInfo((u) => ({ ...u, username: editUsername }));
      setEditPassword("");
    } else {
      setMessage("Failed to update profile. Username may be taken.");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 mb-10">
      <div className="flex items-center gap-4 mb-8">
        <span className="inline-block w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-3xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
          </svg>
        </span>
        <div>
          <div className="text-2xl font-bold text-gray-800">{userInfo.username}</div>
          <div className="text-gray-500 text-sm">Profile Settings</div>
        </div>
      </div>
      {step === "confirm" && (
        <form className="mb-8 bg-gray-50 rounded-lg p-6 shadow flex flex-col gap-4" onSubmit={handleConfirmPassword}>
          <div className="font-semibold text-gray-700 mb-2">Confirm your password to update profile</div>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            placeholder="Current Password"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition text-lg"
          >
            Confirm
          </button>
          {message && <div className="text-center text-sm mt-2 text-red-600">{message}</div>}
        </form>
      )}
      {step === "edit" && (
        <form className="mb-8 bg-gray-50 rounded-lg p-6 shadow flex flex-col gap-4" onSubmit={handleUpdateProfile}>
          <div className="font-semibold text-gray-700 mb-2">Update Profile</div>
          <input
            type="text"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            placeholder="New Username"
          />
          <input
            type="password"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            placeholder="New Password (leave blank to keep current)"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition text-lg"
          >
            Save Changes
          </button>
          {message && <div className="text-center text-sm mt-2 text-blue-600">{message}</div>}
        </form>
      )}
    </div>
  );
}

export default Profile; 