import React from "react";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

function Content({ title, _id, summary, cover, content, createdAt, author }) {
  return (
    <div className="content-container">
      <div className="post">
        <div className="image">
          <Link to={`/post/${_id}`}>
            <img src={"http://localhost:4000/" + cover} alt={title} />
          </Link>
        </div>

        <div className="content-details">
          <Link to={`/post/${_id}`}>
            <h2 className="post-title">{title}</h2>
          </Link>
          <div className="post-info">
            <span className="author">{author.username}</span>
            <time className="post-date">
              {formatISO9075(new Date(createdAt))}
            </time>
          </div>
          <p className="post-summary">{summary}</p>
        </div>
      </div>
    </div>
  );
}

export default Content;
