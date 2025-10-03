import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import defaultAvatar from "../../src/assets/icon.jpg";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let unsubscribeUserDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
        unsubscribeUserDoc = null;
      }

      if (currentUser) {
        const docRef = doc(db, "WaledUsers", currentUser.uid);
        unsubscribeUserDoc = onSnapshot(
          docRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setUser({ uid: currentUser.uid, ...docSnap.data() });
            } else {
              setUser(currentUser);
            }
          },
          () => {
            setUser(currentUser);
          }
        );
      } else {
        setUser(null);
      }
    });

    return () => {
      if (unsubscribeUserDoc) unsubscribeUserDoc();
      unsubscribeAuth();
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="w-full bg-blue-500 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-full mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="text-white font-extrabold text-2xl tracking-wider transition duration-200 hover:scale-[1.05]"
        >
          The Feed<span className="text-green-300"> Blog</span>
        </Link>

        <button
          className={`lg:hidden bg-transparent border-none cursor-pointer p-2 flex flex-col space-y-1 ${
            open ? "open" : ""
          }`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span
            className={`block w-6 h-[2.5px] bg-white transition duration-300 ${
              open ? "transform translate-y-[7px] rotate-45" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-[2.5px] bg-white transition duration-300 ${
              open ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-[2.5px] bg-white transition duration-300 ${
              open ? "transform -translate-y-[7px] -rotate-45" : ""
            }`}
          ></span>
        </button>

        <nav
          className={`
            hidden lg:flex 
            lg:relative lg:top-0 lg:right-0 lg:bg-transparent lg:shadow-none lg:p-0 lg:min-w-0
            ${
              open
                ? "block absolute top-[60px] right-4 bg-blue-700 rounded-xl p-4 shadow-2xl min-w-[200px] transform scale-y-100"
                : "hidden"
            }
          `}
        >
          <ul
            className={`list-none flex space-x-5 m-0 p-0 items-center ${
              open
                ? "flex-col items-stretch space-x-0 space-y-3"
                : "hidden lg:flex"
            }`}
          >
            <li>
              <Link
                to="/about"
                onClick={() => setOpen(false)}
                className="text-white/80 px-3 py-2 rounded-lg font-semibold transition duration-250 hover:bg-white/10 hover:text-white hover:transform hover:-translate-y-px block"
              >
                About
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-200 hover:bg-white/10 block"
                  >
                    <img
                      src={user.photoURL || defaultAvatar}
                      alt="user avatar"
                      className="w-9 h-9 rounded-full object-cover border-2 border-green-300"
                      onError={(e) => {
                        if (e.currentTarget.src !== defaultAvatar) {
                          e.currentTarget.src = defaultAvatar;
                        }
                      }}
                    />
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold border-none cursor-pointer transition duration-250 hover:bg-green-600 hover:scale-[1.05] block w-full text-left"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="bg-green-300 text-gray-900 px-4 py-2 rounded-lg font-bold transition duration-250 hover:bg-green-400 hover:scale-[1.05] block w-full text-left"
                  onClick={() => setOpen(false)}
                >
                  Login / SignIn
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
