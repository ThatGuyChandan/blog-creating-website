import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const Navbar = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/profile`, {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);

  function logout() {
    fetch(`${API_URL}/auth/logout`, {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }
  const username = userInfo?.username;

  return (
    <header className="head">
      <Link to="/" className="logo">
        Blog
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create post</Link>
            <button className="logoutBtn" onClick={logout}>
              Logout
            </button>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
