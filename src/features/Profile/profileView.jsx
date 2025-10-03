import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, storage } from "../../../firebase/config";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import Loader from "../home/Loader";
import { FaUserEdit, FaPhone, FaMapMarkerAlt, FaSignOutAlt, FaEdit, FaTrashAlt, FaImage, FaTimes, FaSave, FaUserCircle } from 'react-icons/fa';

export default function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  const [posts, setPosts] = useState([]);
  const [postEditing, setPostEditing] = useState(null);
  const [postForm, setPostForm] = useState({ title: "", desc: "" });
  const [postNewImage, setPostNewImage] = useState(null);
  const [postSaving, setPostSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "WaledUsers", user.uid);
          const docSnap = await getDoc(docRef);
          const userData = docSnap.exists()
            ? { ...docSnap.data(), email: user.email }
            : { email: user.email, name: user.displayName || "" };
          
          setProfile(userData);
          setFormData(userData);

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
        } catch (err) {
          console.error("❌ Error fetching data:", err);
          toast.error("Failed to load profile data.");
        }
      } else {
        setProfile(null);
        setPosts([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(
        storage,
        `avatars/${auth.currentUser.uid}-${file.name}`
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData((prev) => ({ ...prev, photoURL: url }));
      toast.success("Avatar preview updated! Don't forget to save profile.");
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, "WaledUsers", auth.currentUser.uid);
      await updateDoc(docRef, {
        name: formData.name,
        photoURL: formData.photoURL || "",
        phone: formData.phone || "",
        location: formData.location || "",
      });
      setProfile(formData);
      setEditing(false);
      toast.success("Profile saved successfully!");
    } catch (err) {
      console.error(" Error updating profile:", err);
      toast.error("Failed to save profile.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info("Logged out successfully.");
      navigate("/login");
    } catch (err) {
      console.error(" Error logging out:", err);
      toast.error("Logout failed.");
    }
  };

  const handleEditPost = (post) => {
    setPostEditing(post.id);
    setPostForm({ title: post.title || "", desc: post.desc ?? post.content ?? "" });
    setPostNewImage(null);
  };

  const handleSavePost = async () => {
    if (postSaving) return;
    try {
      setPostSaving(true);
      const docRef = doc(db, "WaledPosts", postEditing);

      const current = posts.find((p) => p.id === postEditing) || {};
      let imageUrl = current.image || "";
      if (postNewImage) {
        const storageRef = ref(storage, `posts/${Date.now()}-${postNewImage.name}`);
        await uploadBytes(storageRef, postNewImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      const updated = {
        title: postForm.title,
        desc: postForm.desc,
        image: imageUrl,
      };

      await updateDoc(docRef, updated);

      setPosts((prev) =>
        prev.map((p) => (p.id === postEditing ? { ...p, ...updated } : p))
      );
      setPostEditing(null);
      setPostForm({ title: "", desc: "" });
      setPostNewImage(null);
      toast.success("Post updated successfully!");
    } catch (err) {
      console.error(" Error updating post:", err);
      toast.error("Failed to update post.");
    } finally {
      setPostSaving(false);
    }
  };

  const handleDeletePost = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this post?");
    if (!isConfirmed) return;
    
    try {
      await deleteDoc(doc(db, "WaledPosts", id));
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deleted successfully!");
    } catch (err) {
      console.error(" Error deleting post:", err);
      toast.error("Failed to delete post.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-500">
        <Loader message="Loading profile and posts..." />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50 to-blue-500">
        <Link 
          to="/login" 
          className="text-2xl font-bold text-green-600 p-6 bg-white rounded-xl shadow-2xl transition duration-300 hover:bg-green-50 hover:shadow-green-500/50 cursor-pointer text-center block"
        >
          Click to Log In
        </Link>
      </div>
    );
  }

  return (
    <div className=" max-w-4xl mx-auto p-4 md:p-6 lg:p-10 font-sans">
      
      <div className=" rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
        
        <div className="h-40 bg-cyan-500 relative">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <img
            src={profile.photoURL || "https://via.placeholder.com/150"}
            alt="profile"
            className="w-36 h-36 rounded-full absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 border-6 border-white object-cover shadow-xl transition duration-300 hover:scale-[1.05]"
          />
        </div>

        <div className="p-8 pt-16 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {profile.name || "Unknown User"}
          </h2>
          <p className="text-md text-gray-500 mb-4">{profile.email}</p>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-base text-gray-700 mb-6">
            {profile.phone && (
              <p className="flex items-center space-x-2">
                <FaPhone className="text-teal-500" />
                <span>
                  <span className="font-semibold ml-1">{profile.phone}</span>
                </span>
              </p>
            )}
            {profile.location && (
              <p className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-teal-500" />
                <span>
                  <span className="font-semibold">{profile.location}</span>
                </span>
              </p>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <button 
              className="flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-white bg-green-500 hover:bg-green-600 transition duration-200 shadow-lg transform hover:scale-[1.05]" 
              onClick={() => setEditing(true)}
            >
              <FaUserEdit />
              <span>Edit Profile</span>
            </button>
            <button 
              className="flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-white bg-red-500 hover:bg-red-600 transition duration-200 shadow-lg transform hover:scale-[1.05]" 
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-4 border-green-500 pb-2 flex items-center space-x-2">
          <span>My Posts</span> 
          <span className="text-lg text-green-600 font-extrabold">({posts.length})</span>
        </h3>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-gray-500 p-6 bg-gray-100 rounded-xl text-center shadow-inner">No posts yet. Share one !</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl p-4 shadow-lg flex items-center justify-between transition-all duration-200 hover:shadow-xl hover:ring-2 hover:ring-green-300">
                <div 
                  className="flex items-center space-x-4 cursor-pointer flex-1 min-w-0" 
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  {post.image ? (
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
                      <FaImage />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-800 truncate">{post.title}</h4>
                    <p className="text-sm text-gray-500 truncate">{post.desc?.substring(0, 100) || post.content?.substring(0, 100) || "No content preview..."}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-sm transition duration-150" 
                    onClick={() => handleEditPost(post)}
                  >
                    <FaEdit className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button 
                    className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition duration-150" 
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <FaTrashAlt className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {postEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2"><FaEdit className="text-green-600"/><span>Edit Post</span></h2>
            <div className="space-y-4">
              <div className="w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-100">
                <img
                  src={
                    postNewImage
                      ? URL.createObjectURL(postNewImage)
                      : posts.find((p) => p.id === postEditing)?.image || "https://via.placeholder.com/500x200"
                  }
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                  type="text"
                  placeholder="Title"
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                />
                <textarea
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 resize-vertical focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                  placeholder="Description"
                  rows={4}
                  value={postForm.desc}
                  onChange={(e) => setPostForm({ ...postForm, desc: e.target.value })}
                />
                <label className="flex items-center space-x-2 w-full px-4 py-3 border-2 border-dashed border-green-400 rounded-xl bg-green-50 text-green-700 font-semibold cursor-pointer text-center hover:bg-green-100 transition">
                  <FaImage />
                  <span>Change Image </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPostNewImage(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  {postNewImage && <span className="ml-auto text-gray-600 truncate">{postNewImage.name}</span>}
                </label>
                <div className="flex justify-end space-x-3 pt-2">
                  <button 
                    className="flex items-center space-x-1 px-4 py-2 font-bold rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 transition shadow-md" 
                    onClick={() => {
                        setPostEditing(null);
                        setPostNewImage(null);
                    }} 
                    disabled={postSaving}
                  >
                    <FaTimes />
                    <span>Cancel</span>
                  </button>
                  <button 
                    className={`flex items-center space-x-1 px-4 py-2 font-bold rounded-full text-white shadow-lg transition ${postSaving ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`} 
                    onClick={handleSavePost} 
                    disabled={postSaving}
                  >
                    <FaSave />
                    <span>{postSaving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2"><FaUserEdit className="text-green-600"/><span>Edit Profile</span></h2>

            <div className="flex flex-col space-y-4">
              <div className="flex justify-center mb-2 relative">
                <img
                  src={formData.photoURL || profile.photoURL || "https://via.placeholder.com/150"}
                  alt="avatar preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-green-200 shadow-md"
                />
                <div className="absolute bottom-0 right-[40%] bg-white rounded-full p-1 border border-green-500 text-green-500">
                    <FaUserCircle className="w-4 h-4"/>
                </div>
              </div>

              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                type="text"
                placeholder="Full Name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                type="text"
                placeholder="Phone"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                type="text"
                placeholder="Location (e.g., City, Country)"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />

              <label className="block w-full px-4 py-3 border-2 border-dashed border-teal-400 rounded-xl bg-teal-50 text-teal-700 font-semibold cursor-pointer text-center hover:bg-teal-100 transition">
                <FaImage className="inline mr-2"/>
                Upload pic 
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>

              {uploading && <p className="text-sm text-green-500 text-center mt-1">Uploading pic...</p>}

              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  className="px-4 py-2 font-bold rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 transition shadow-md" 
                  onClick={() => setEditing(false)}
                >
                  <FaTimes className="inline mr-1" />
                  Cancel
                </button>
                <button 
                  className="flex items-center space-x-1 px-4 py-2 font-bold rounded-full text-white bg-green-600 hover:bg-green-700 transition shadow-lg" 
                  onClick={handleSave}
                >
                  <FaSave />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}