import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-blue-50 to-blue-500 text-center p-6">
      
      <h1 className="text-6xl font-extrabold text-indigo-700 mb-6 tracking-tight drop-shadow-lg">
        Error 404
      </h1>
      
      <img 
        className="w-full max-w-sm h-auto rounded-xl shadow-2xl mb-8 transform hover:scale-105 transition duration-500"
        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif" 
        alt="Page Not Found Illustration" 
      />
      
      <h2 className="text-3xl font-semibold mb-4 text-gray-800">
        Page Not Found
      </h2>
      
      <p className="mt-2 text-lg text-gray-600 mb-10 max-w-md">
        Sorry, the page you are looking for might have been removed or temporarily unavailable.
      </p>

      <Link 
        to="/" 
        className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-full shadow-xl hover:bg-indigo-700 transition duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
      >
        Go Home
      </Link>
      
    </div>
  );
}