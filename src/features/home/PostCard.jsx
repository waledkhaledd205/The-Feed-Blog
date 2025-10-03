import React from "react";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const defaultAvatar = "https://via.placeholder.com/150";

  return (
    <Link 
      to={`/posts/${post.id}`} 
      // .post-card (combined classes for styling and hover effects)
      className="post-card bg-white border border-gray-200 rounded-2xl p-4 text-decoration-none flex flex-col transition duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 overflow-hidden h-full"
    >
      
      {post.image && (
        // .post-image-wrapper
        <div className="w-full h-48 overflow-hidden rounded-xl mb-3 border border-gray-300 flex items-center justify-center bg-gray-100"> 
          <img
            src={post.image}
            alt={post.title}
            // .post-image (object-contain, transition, and hover scale)
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-[1.05] bg-gray-100" 
          />
        </div>
      )}

      <div className="p-1 flex flex-col flex-grow">
        
        <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
          {/* .post-title */}
          {post.title}
        </h2>

        <p className="text-sm text-gray-600 flex-grow leading-relaxed mb-3 line-clamp-3">
          {/* .post-desc */}
          {post.desc}
        </p>

        {/* .post-footer */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-3 mt-auto">
          
          <div className="flex items-center space-x-2">
            {/* .post-author */}
            <div className="w-8 h-8 rounded-full overflow-hidden object-cover border border-gray-300 ring-1 ring-blue-500 ring-offset-2">
              <img
                // .post-avatar
                src={post.authorAvatar || defaultAvatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {/* .post-author-name */}
              {post.author || "Anonymous"}
            </span>
          </div>
          
          <span className="text-xs text-gray-400">
            {/* .post-date */}
            {post.createdAt?.toDate
              ? post.createdAt.toDate().toLocaleDateString()
              : "Unknown"}
          </span>

        </div>
      </div>
    </Link>
  );
}