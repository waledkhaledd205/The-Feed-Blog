import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";
import { auth } from "../../../firebase/config.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-white via-blue-50 to-blue-500">
      
      <form 
        className="w-full max-w-lg p-8 bg-white rounded-xl shadow-2xl space-y-5" 
        onSubmit={handleLogin}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Login</h2>

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

        <button 
          type="submit" 
          className="w-full py-3 mt-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-200 shadow-md"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-green-600 font-semibold hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}