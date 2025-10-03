import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../../firebase/config.js";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import InputField from "../../components/InputField.jsx";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      alert(" Please fill all required fields.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let uploadedPhotoURL = "";
      if (photoFile) {
        const fileRef = ref(storage, `avatars/${user.uid}-${Date.now()}-${photoFile.name}`);
        await uploadBytes(fileRef, photoFile);
        uploadedPhotoURL = await getDownloadURL(fileRef);
      }

      await setDoc(doc(db, "WaledUsers", user.uid), {
        name: name.trim(),
        email: user.email,
        bio: "New user on our platform 🚀", 
        photoURL: uploadedPhotoURL || "",
        phone: phone.trim() || "",
        location: location.trim() || "",
        createdAt: serverTimestamp(),
      });

      navigate("/profile");
    } catch (error) {
      console.error(" Error registering:", error.code, error.message);
      alert(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-white via-blue-50 to-blue-500">
      
      <form 
        className="w-full max-w-lg p-8 bg-white rounded-xl shadow-2xl space-y-5" 
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Register</h2>

        <InputField
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <InputField
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <label className="block text-sm font-medium text-gray-700 pt-2">
          <span className="mb-2 block">Upload pic </span>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setPhotoFile(file);
              setPhotoPreview(file ? URL.createObjectURL(file) : "");
            }}
          />
          {photoPreview && (
            <div className="mt-3 flex justify-center">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-md"
              />
            </div>
          )}
        </label>

        <InputField
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <InputField
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button 
          type="submit" 
          className="w-full py-3 mt-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-200 shadow-md"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-green-600 font-semibold hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}