import React from "react";
import { Route, Routes } from "react-router-dom";
import Post from "./Post";
import Login from "./Login";
import Register from "./Register";
import CreatePost from "./CreatePost";
import MainContent from "./MainContent";
import EditPost from "./EditPost";
import NotFound from "./NotFound";
const Outlet = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <main>
            <Post />
          </main>
        }
      />
      <Route path={"/login"} element={<Login />} />
      <Route path={"/register"} element={<Register />} />
      <Route path={"/create"} element={<CreatePost />} />
      <Route path={"/post/:id"} element={<MainContent />} />
      <Route path={"/edit/:id"} element={<EditPost />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Outlet;
