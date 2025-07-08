import React from "react";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

function Content({ title, _id, summary, cover, content, createdAt, author }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden">
      <Link to={`/post/${_id}`} className="block h-56 overflow-hidden">
        <img
          src={cover && (cover.startsWith('http') ? cover : process.env.REACT_APP_API_URL + '/' + cover)}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
        />
      </Link>
      <div className="flex-1 flex flex-col p-6">
        <Link to={`/post/${_id}`} className="hover:underline">
          <h2 className="text-2xl font-bold mb-2 text-gray-800 line-clamp-2">{title}</h2>
        </Link>
        <div className="flex items-center text-sm text-gray-500 mb-2 space-x-2">
          <span className="font-medium">{author.username}</span>
          <span>&bull;</span>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-3">{summary}</p>
        <Link to={`/post/${_id}`} className="mt-auto inline-block text-blue-600 font-semibold hover:underline">Read More &rarr;</Link>
      </div>
    </div>
  );
}

export default Content;
