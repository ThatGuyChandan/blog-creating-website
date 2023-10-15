import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "./UserContext";

function MainContent() {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, [id]);
  if (!postInfo) {
    return "";
  }
  return (
    <main>
      <div className="innerContent">
        <h1>{postInfo.title}</h1>
        <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
        <div className="author">By {postInfo.author.username}</div>
        {userInfo.id === postInfo.author._id && (
          <div className="editRow">
            <Link className="editBtn" to={`/edit/${postInfo._id}`}>
              Edit
            </Link>
          </div>
        )}
        <div className="innerImage">
          <img
            src={`http://localhost:4000/${postInfo.cover}`}
            alt="Not found"
          ></img>
        </div>
        <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
      </div>
    </main>
  );
}

export default MainContent;
