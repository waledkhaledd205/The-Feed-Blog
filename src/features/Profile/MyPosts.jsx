import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/config";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", desc: "" });
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(
            collection(db, "WaledPosts"),
            where("authorId", "==", user.uid)
          );
          const querySnap = await getDocs(q);
          const userPosts = querySnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          setPosts(userPosts);
          console.log("User posts loaded:", userPosts);
        } catch (err) {
          console.error(" Error loading posts:", err);
        }
      } else {
        setPosts([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    
  }, [loading, posts.length, navigate]);

  if (loading) return (
    <p className="text-center text-lg text-yellow-400 mt-10 font-medium">
        Loading your posts...
    </p>
  );

  const startEdit = (post) => {
    setEditingId(post.id);
    setForm({ title: post.title || "", desc: post.desc || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", desc: "" });
  };

  const saveEdit = async () => {
    try {
      await updateDoc(doc(db, "WaledPosts", editingId), {
        title: form.title,
        desc: form.desc,
      });
      setPosts((prev) => prev.map((p) => (p.id === editingId ? { ...p, title: form.title, desc: form.desc } : p)));
      cancelEdit();
    } catch (e) {
      console.error("Error updating post:", e);
    }
  };

  const openDeleteConfirm = (id) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);
  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "WaledPosts", deleteId));
      setPosts((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (e) {
      console.error("Error deleting post:", e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-5 min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      
      {posts.length === 0 ? (
        <section className="text-center mt-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">No posts yet</h2>
          <p className="text-lg text-yellow-400 mb-6 font-medium">Get started and create your own posts!</p>
          <button className="btn btn-success" onClick={() => navigate("/add")}>Add Post</button>
        </section>
      ) : (
        <>
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">My Posts</h1>
          <div className="grid gap-5 grid-cols-auto-fit-minmax-280">
            {posts.map((post) => (
              <div 
                key={post.id} 
                // ✨ التعديل هنا للانتقال لصفحة التفاصيل
                onClick={() => navigate(`/post/${post.id}`)}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 flex flex-col cursor-pointer"
              >
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={post.image || "https://via.placeholder.com/300"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-gray-700">{post.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed flex-grow">
                    {post.desc}
                  </p>
                  <small className="text-xs text-gray-500 mb-3">✍️ By {post.author}</small>
                  {/* منع انتقال النقر للبوست عند الضغط على أزرار التعديل والحذف */}
                  <div className="flex justify-end gap-3 mt-auto" onClick={(e) => e.stopPropagation()}>
                    <button className="btn btn-sm btn-info" onClick={() => startEdit(post)}>Edit</button>
                    <button className="btn btn-sm btn-error" onClick={() => openDeleteConfirm(post.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg mx-4">
            <h2 className="text-2xl font-bold mb-4"> Edit Post</h2>
            <input
              type="text"
              placeholder="Title"
              className="input input-bordered w-full mb-3"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="textarea textarea-bordered w-full mb-5"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />
            <div className="flex justify-end gap-3">
              <button className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm mx-4 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-3">🗑️ Delete this post?</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button className="btn btn-ghost" onClick={cancelDelete}>Cancel</button>
              <button className="btn btn-error" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}