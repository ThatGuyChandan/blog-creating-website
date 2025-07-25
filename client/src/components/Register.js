import React, { useState } from "react";
import { Navigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  async function handleRegister(ev) {
    ev.preventDefault();
    setError("");
    setSuccessMsg("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: "POST",
        body: JSON.stringify({ username, password, email }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg(data.message || "Registration request submitted. Await admin approval.");
        setUsername(""); setPassword(""); setConfirmPassword(""); setEmail("");
      } else {
        setError(data.error || "Registration failed. Please try a different username or email.");
      }
    } catch (err) {
      setError("Registration failed. Please try again later.");
    }
  }

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 mb-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Register</h2>
      {error && <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>}
      {successMsg && <div className="mb-4 text-green-600 text-center font-semibold">{successMsg}</div>}
      <form onSubmit={handleRegister} className="space-y-6">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg pr-12"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 16.273 7.418 19.5 12 19.5c1.658 0 3.237-.322 4.646-.904M21.065 11.977a10.45 10.45 0 00-2.065-3.754M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.25 6.25L3.75 3.75" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.003C3.64 7.73 7.52 4.5 12 4.5c4.48 0 8.36 3.23 9.75 7.503-1.39 4.273-5.27 7.504-9.75 7.504-4.48 0-8.36-3.231-9.75-7.504z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(ev) => setConfirmPassword(ev.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg pr-12"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
            onClick={() => setShowConfirmPassword((v) => !v)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 16.273 7.418 19.5 12 19.5c1.658 0 3.237-.322 4.646-.904M21.065 11.977a10.45 10.45 0 00-2.065-3.754M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.25 6.25L3.75 3.75" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.003C3.64 7.73 7.52 4.5 12 4.5c4.48 0 8.36 3.23 9.75 7.503-1.39 4.273-5.27 7.504-9.75 7.504-4.48 0-8.36-3.231-9.75-7.504z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition text-lg"
        >
          Register
        </button>
      </form>
      <div className="mt-4 text-gray-500 text-sm text-center">
        After submitting, your account will be reviewed by an admin. You will receive an email when your account is approved.
      </div>
    </div>
  );
}

export default Register;
