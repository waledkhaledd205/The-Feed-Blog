import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config"; 
import { toast } from "react-toastify";

export default function AddPostButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    const user = auth.currentUser;
    console.log("🔍 Current user:", user);

    if (user) {
      console.log("✅ User is logged in:", user.email);
      navigate("/add");
    } else {
      console.log("No user logged in");
      toast.error("You must login first!");
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="
        fixed 
        bottom-8 
        right-8 
        w-14              
        h-14              
        rounded-full 
        bg-emerald-500    
        text-white 
        font-medium 
        flex 
        items-center 
        justify-center 
        cursor-pointer 
        shadow-2xl 
        transition 
        duration-300 
        ease-in-out
        
        hover:bg-emerald-600 
        hover:scale-[1.1]       
        hover:shadow-emerald-500/50 
      "
      aria-label="Add New Post"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
  );
}