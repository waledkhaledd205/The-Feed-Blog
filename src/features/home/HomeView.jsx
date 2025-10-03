import React, { useEffect, useState } from "react";
import AddButton from "../../components/addbuttom";
import { db } from "../../../firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import PostCard from "../../features/home/PostCard"; 
import NoPosts from "./NoPosts";
import AddPostButton from "../../components/AddPostButton";
import Loader from "./Loader";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "WaledPosts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(postsData);
    } catch (err) {
      console.error("Error fetching posts: ", err);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-500 p-6">
      
      {loading ? (
        <Loader message="Loading posts..." />
      ) : posts.length === 0 ? (
        <NoPosts />
      ) : (
        <div className="flex flex-col items-center max-w-xl mx-auto space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="w-full">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}

      <AddPostButton onClick={() => (window.location.href = "/add")} />

    </div>
  );
}