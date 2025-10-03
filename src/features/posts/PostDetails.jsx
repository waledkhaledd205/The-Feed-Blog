  import React, { useEffect, useState } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import { db, auth, storage } from "../../../firebase/config";
  import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import Loader from "../home/Loader";
  import ConfirmModal from "../../components/ConfirmModal";

  export default function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ title: "", desc: "" });
    const [newImage, setNewImage] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
      const fetchPost = async () => {
        try {
          const snap = await getDoc(doc(db, "WaledPosts", id));
          if (snap.exists()) {
            const data = { id: snap.id, ...snap.data() };
            setPost(data);
            setForm({ title: data.title || "", desc: data.desc || "" });
          } else {
            setError("Post not found.");
          }
        } catch (err) {
          console.error("Error fetching post:", err);
          setError("Error loading post data.");
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }, [id]);

    const isAuthor =
      auth.currentUser && post && auth.currentUser.uid === post.authorId;

    const handleSave = async () => {
      if (!post) return;
      setSaving(true);
      setError(null);
      try {
        let imageUrl = post.image || "";
        if (newImage) {
          const storageRef = ref(storage, `posts/${Date.now()}-${newImage.name}`);
          await uploadBytes(storageRef, newImage);
          imageUrl = await getDownloadURL(storageRef);
        }
        
        const updatedData = {
          title: form.title,
          desc: form.desc,
          image: imageUrl,
        };

        await updateDoc(doc(db, "WaledPosts", post.id), updatedData);
        
        setPost((prev) => ({
          ...prev,
          ...updatedData,
        }));
        setEditing(false);
        setNewImage(null);
      } catch (err) {
        console.error("Error saving post:", err);
        setError("Failed to save post. Please try again.");
      } finally {
        setSaving(false);
      }
    };

    const handleDelete = () => {
      if (!post) return;
      setShowConfirm(true);
    };

    const confirmDelete = async () => {
      if (!post) return;
      setDeleting(true);
      setError(null);
      try {
        await deleteDoc(doc(db, "WaledPosts", post.id));
        navigate("/");
      } catch (err) {
        console.error("Error deleting post:", err);
        setError("Failed to delete post.");
      } finally {
        setDeleting(false);
        setShowConfirm(false);
      }
    };

    if (loading) return <Loader />;
    if (!post || error) return (
      <div className="flex justify-center items-center text-2xl font-bold text-red-600 bg-gray-50 py-20">
        ⚠️ {error || "Post not found"}
      </div>
    );

    const currentImage = newImage ? URL.createObjectURL(newImage) : post.image;
    
    return (
      <div className="flex justify-center py-10 px-4 bg-gradient-to-b from-white via-blue-50 to-blue-500">
        
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          
          {error && (
            <div className="p-4 bg-red-100 text-red-700 font-medium text-center border-b border-red-300">
              {error}
            </div>
          )}

          {editing ? (
            
            <div className="p-6 md:p-8 space-y-6">
              
              <div className={`w-full rounded-xl overflow-hidden shadow-lg border-2 border-dashed flex items-center justify-center bg-gray-100 ${currentImage ? 'border-gray-300' : 'border-red-400 bg-red-50'}`}>
                <img 
                  src={currentImage || "/default-placeholder.svg"} 
                  alt="Preview" 
                  className="max-h-80 w-full object-contain" 
                />
              </div>

              <div className="space-y-4">
                <input
                  className="w-full text-3xl font-extrabold text-gray-900 border-b-2 border-gray-200 focus:border-emerald-500 focus:outline-none py-2 px-1 transition duration-200"
                  type="text"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <textarea
                  className="w-full text-lg text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none transition duration-200"
                  placeholder="Description"
                  rows={6}
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                />
                
                <label className="flex items-center space-x-3 p-3 border-2 border-dashed border-emerald-400 rounded-lg bg-emerald-50 cursor-pointer hover:bg-emerald-100 transition duration-200">
                  <span className="text-emerald-700 font-medium">🖼️ Change Image </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewImage(e.target.files?.[0] || null)
                    }
                    className="hidden"
                  />
                  {newImage && <span className="text-gray-600 truncate">{newImage.name}</span>}
                </label>

                <div className="flex space-x-4 pt-2">
                  <button 
                    className={`flex-1 py-3 px-4 rounded-full font-bold text-white shadow-lg transition duration-200 ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 hover:shadow-emerald-500/50'}`} 
                    onClick={handleSave} 
                    disabled={saving}
                  >
                    {saving ? " Saving..." : "Save Changes"}
                  </button>
                  <button 
                    className={`py-3 px-4 rounded-full font-bold text-gray-700 border border-gray-300 bg-white hover:bg-gray-100 transition duration-200 ${saving ? 'cursor-not-allowed opacity-70' : ''}`} 
                    onClick={() => {
                      setEditing(false);
                      setForm({ title: post.title, desc: post.desc });
                      setNewImage(null);
                    }} 
                    disabled={saving}
                  >
                      Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            
            <div className="read-view">
              {post.image && (
                <div className="w-full flex items-center justify-center bg-gray-100"> 
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="max-h-80 w-full object-contain" 
                  />
                </div>
              )}

              <div className="p-6 md:p-8 space-y-4">
                <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                  {post.title}
                </h1>
                <p className="text-lg text-gray-700 whitespace-pre-line">
                  {post.desc}
                </p>
              </div>
            </div>
          )}
          
          <div className="p-6 md:p-8 flex justify-between items-center border-t border-gray-100">
            
            <div className="flex items-center space-x-3">
              <img
                src={post.authorAvatar || "/default-avatar.png"}
                alt="Author Avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
              />
              <span className="font-semibold text-gray-800">
                @{post.author || "Anonymous"}
              </span>
            </div>

            <div className="flex space-x-3">
              <button 
                className="py-2 px-4 rounded-full font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition duration-200 shadow-md" 
                onClick={() => navigate("/")}
              >
                Back to Posts
              </button>
              
              {isAuthor && !editing && (
                  <>
                  <button 
                    className="py-2 px-4 rounded-full font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition duration-200 shadow-md" 
                    onClick={() => setEditing(true)}
                  >
                    Edit 
                  </button>
                  <button 
                    className="py-2 px-4 rounded-full font-medium text-white bg-red-500 hover:bg-red-600 transition duration-200 shadow-md" 
                    onClick={handleDelete}
                  >
                    Delete 
                  </button>
                  </>
              )}
            </div>
          </div>
        </div>

        <ConfirmModal
          open={showConfirm}
          title="Delete Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    );
  }
