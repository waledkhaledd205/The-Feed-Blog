import React from "react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      
      <span 
        className="loading loading-spinner text-success text-9xl mb-4" 
        role="status" 
        aria-live="polite"
      ></span>
      
      <p className="text-xl font-semibold text-gray-700">Loading...</p>
    </div>
  );
}