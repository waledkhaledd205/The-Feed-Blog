import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCRD-GRmhGUmtzGOSxBP0L0ObQKBC5Md2U",
  authDomain: "social-media-686a8.firebaseapp.com",
  projectId: "social-media-686a8",
  storageBucket: "social-media-686a8.firebasestorage.app",
  messagingSenderId: "853324556463",
  appId: "1:853324556463:web:9910ebaa50a62cafb58c5a",
  measurementId: "G-9Q0YYXHCY7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;