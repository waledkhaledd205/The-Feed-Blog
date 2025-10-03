import React from "react";

export default function NoPosts() {
  return (
    <div className="flex flex-col items-center justify-center h-80 text-center p-6  rounded-xl shadow-inner max-w-lg mx-auto my-10">
    
      <span className="text-6xl text-indigo-400 mb-4 transform hover:scale-110 transition duration-300">
        
      </span>

      <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
        Nothing to See Here!
      </h2>
      
      <p className="text-lg text-gray-600">
        Add posts Now !
      </p>
      
    </div>
  );
}