import { useState } from "react";
import { db, storage, auth } from "../../../firebase/config";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import Confirm from "../../components/Confirm"; 
function AddPost() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); 

  const isDataPresent = title.trim() !== "" || desc.trim() !== "" || imageFile !== null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      e.target.value = null; 
    }
  };
  
  const handleClearForm = () => {
    setTitle("");
    setDesc("");
    setImageFile(null);
    setPreviewUrl(null);
    toast.info("Form cleared successfully.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title && !desc && !imageFile) return; 
    setShowConfirm(true); 
  };
  
  const confirmAndPublish = async () => {
    setShowConfirm(false); 
    setLoading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        const storageRef = ref(storage, `posts/${Date.now()}-${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login first!");
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, "WaledUsers", user.uid);
      const userDoc = await getDoc(userDocRef);

      let profileData = {};
      if (userDoc.exists()) {
        profileData = userDoc.data();
      }

      await addDoc(collection(db, "WaledPosts"), {
        title,
        desc,
        image: imageUrl,
        createdAt: serverTimestamp(),
        author: profileData.name || user.displayName || "Unknown User",
        authorId: user.uid,
        authorEmail: user.email,
        authorAvatar:
          profileData.photoURL || user.photoURL || "/default-avatar.png",
      });

      toast.success("Post added successfully!");
      setTitle("");
      setDesc("");
      setImageFile(null);
      setPreviewUrl(null);
    } catch (err) {
      toast.error("Error try again ");
      console.error("❌ Error adding post: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-10 pb-10 px-4 bg-gradient-to-b from-white via-blue-50 to-blue-500 min-h-screen"> 
      
      <form 
        onSubmit={handleSubmit} 
        className="
          rounded-3xl 
          p-4 
          w-full 
          max-w-md 
          shadow-xl shadow-gray-300/50 
          transition-all 
          duration-300 
          ease-in-out
          border border-gray-100
        "
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center tracking-tight">
          Add New Post
        </h2>

        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="
            w-full border-none rounded-xl p-3 mb-3 text-base text-gray-800 bg-gray-100 transition-all duration-200 
            focus:bg-white focus:border focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20
          "
          required
        />

        <textarea
          placeholder="Add your content..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="
            w-full border-none rounded-xl p-3 mb-3 text-base text-gray-800 bg-gray-100 resize-none min-h-[80px] transition-all duration-200 
            focus:bg-white focus:border focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20
          "
          required
        />

        <label 
          className="
            flex justify-center items-center border-2 border-solid border-gray-400 rounded-xl p-4 
            bg-white text-gray-600 font-medium mb-4 cursor-pointer transition-all duration-300
            hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-600
          "
        >
          <span>Add Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden" 
          />
        </label>

        {previewUrl && (
          <div className="mb-4 bg-white p-2 rounded-xl border border-gray-200 shadow-md text-center">
            <p className="text-sm font-medium mb-3 text-gray-600">🖼️ Preview</p>
            <img 
              src={previewUrl} 
              alt="preview" 
              className="w-full h-auto max-h-40 object-contain rounded-xl border border-gray-300 transition-transform duration-300 hover:scale-[1.02]" 
            />
          </div>
        )}

        <div className="flex space-x-3">
            {isDataPresent && (
                <button 
                    type="button" 
                    onClick={handleClearForm}
                    className={`
                        flex-1 py-3 font-bold text-gray-700 rounded-full text-lg 
                        shadow-md transition duration-300 ease-in-out
                        bg-gray-200 hover:bg-gray-300 hover:scale-[1.02]
                        ${loading ? 'cursor-not-allowed opacity-70' : ''}
                    `}
                    disabled={loading}
                >
                    Clear Form
                </button>
            )}
            <button 
                type="submit" 
                disabled={loading || !isDataPresent} 
                className={`
                    ${isDataPresent ? 'flex-1' : 'w-full'} py-3 font-bold text-white rounded-full text-lg 
                    shadow-2xl transition duration-300 ease-in-out transform
                    
                    ${loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-emerald-500 hover:bg-emerald-600 hover:scale-[1.03] hover:shadow-emerald-500/50'
                    }
                `}
            >
                {loading ? "Uploading..." : "Share Post "}
            </button>
        </div>

      </form>

      <Confirm
        open={showConfirm}
        title="Confirm Post"
        message="Are you sure you want to share this content?"
        confirmText="Share"
        cancelText="Cancel"
        busy={loading}
        onConfirm={confirmAndPublish} 
        onCancel={() => setShowConfirm(false)}
      />

    </div>
  );
}

export default AddPost;