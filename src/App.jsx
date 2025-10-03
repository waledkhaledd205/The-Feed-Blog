import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Pages/home/HomeView.jsx";
import Login from "./Pages/auth/Login.jsx";
import AddPost from "./Pages/posts/AddPost.jsx";
import About from "./Pages/about/About.jsx";
import Register from "./Pages/auth/Register.jsx";
import PageNotFound from "./Pages/about/NotFound.jsx";
import ProfileView from "./Pages/Profile/profileView.jsx";
import { ToastContainer } from "react-toastify";
import MyPosts from "./Pages/Profile/MyPosts.jsx";
import PostDetails from "./Pages/posts/PostDetails.jsx";
import Loader from "./Pages/home/Loader.jsx";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
export default function App() {
  const [authInitializing, setAuthInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setAuthInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  if (authInitializing) {
    return (
      <>
        <ToastContainer position="top-center" autoClose={3000} />
        <Navbar />
        <div className="page-container">
          <Loader message=" Loading..." />
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Navbar />
      <div className="page-container bg-gradient-to-b from-white via-blue-50 to-blue-500">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/add" element={<AddPost />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/MyPosts" element={<MyPosts />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  );
}
