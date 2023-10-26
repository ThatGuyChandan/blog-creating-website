import React, { useEffect, useState } from "react";
import Content from "./Content";
const Post = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("https://blogcreationbackend.onrender.com/post").then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <div>{posts.length > 0 && posts.map((post) => <Content {...post} />)}</div>
  );
};

export default Post;
