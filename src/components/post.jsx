import React from "react";

export default function Post({
  postTitle,
  postDescription,
  postImage,
  postAuthor,
  postedAt,
  authorAvatar,
}) {
  return (
    <article className="max-w-3xl mx-auto my-4 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row lg:gap-0">
      <div className="w-full h-64 overflow-hidden lg:flex-none lg:w-2/5">
        <img
          className="w-full h-full object-cover block"
          src={postImage}
          alt="Post"
        />
      </div>

      <div className="p-5 lg:p-6 lg:flex-1 flex flex-col justify-between">
        <div>
          <h3 className="mb-2 text-2xl font-bold leading-tight text-gray-800">
            {" "}
            {postTitle}
          </h3>
          <p className="mb-4 text-gray-600 leading-relaxed">
            {postDescription}
          </p>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <img
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
              src={authorAvatar}
              alt="Author"
            />
            <div className="author-info">
              <span className="font-semibold text-gray-800">{postAuthor}</span>
              <span className="block text-gray-500 text-sm mt-0.5">
                {" "}
                {postedAt}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-blue-300 font-semibold cursor-pointer bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
              Edit
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-red-300 font-semibold cursor-pointer bg-red-50 text-red-700 hover:bg-red-100 transition">
              delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
