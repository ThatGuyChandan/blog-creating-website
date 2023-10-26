import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Add state for error messages

  async function register(ev) {
    ev.preventDefault();

    const response = await fetch(
      "https://blogcreationbackend.onrender.com/register",
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 201) {
      alert("Registration successful");
    } else {
      const data = await response.json(); // Parse the error response
      setErrorMessage(data.error || alert("Failed to register")); // Set error message
    }
  }

  return (
    <main>
      <form className="register" onSubmit={register}>
        <h1>Register</h1>
        <label>UserName:</label>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <br />
        <br />
        <button>Register</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}{" "}
      {/* Display error message if there is one */}
      <Link to="/login">Already registered?</Link>
    </main>
  );
};

export default Register;
