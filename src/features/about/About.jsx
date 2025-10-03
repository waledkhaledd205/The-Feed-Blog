import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const listContainerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 10 } 
  }
};


export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-500 flex items-center justify-center p-6">
      
      <motion.div 
        className="app-container w-full max-w-4xl shadow-2xl border border-blue-300 rounded-3xl"
        data-theme="light"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        <div className="card-content p-8 lg:p-10 font-sans bg-base-100 rounded-3xl border border-blue-200">
          
          <h1 className="header text-3xl font-extrabold text-center text-blue-800 mb-8 pb-2 inline-block mx-auto w-auto">
            Final Project: Blog Application
          </h1>
          
         <p className="description text-xl text-gray-700 mb-10 text-center font-medium leading-relaxed border p-4 rounded-xl border-gray-300 bg-gray-50">
  This final project involves the development of a complete <strong className="text-blue-600">Blog Application</strong> using <strong className="text-blue-600">React.js</strong>. The application showcases proficiency in all core course concepts: component architecture, state and props management, routing, form handling, and integration with a live backend service.
</p>

          <h2 className="section-title text-2xl font-semibold text-blue-700 mb-6 text-center pb-2">
              Core Concepts
          </h2>

          <motion.div 
            className="concept-list grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
          >
            
            <motion.div 
              className="concept-card bg-white p-5 shadow-xl border-2 border-blue-100 rounded-xl"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <div className="flex items-center space-x-3">
                <div className="icon text-3xl text-blue-500">🧱</div>
                <div>
                  <h3 className="title text-lg font-bold text-gray-900">Components & Props</h3>
                  <p className="text-sm text-gray-600">Building reusable UI elements for posts, headers, and forms.</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="concept-card bg-white p-5 shadow-xl border-2 border-blue-100 rounded-xl"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <div className="flex items-center space-x-3">
                <div className="icon text-3xl text-blue-500">💾</div>
                <div>
                  <h3 className="title text-lg font-bold text-gray-900">State Management</h3>
                  <p className="text-sm text-gray-600">Handling user sessions, form input, and post data updates.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="concept-card bg-white p-5 shadow-xl border-2 border-blue-100 rounded-xl"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <div className="flex items-center space-x-3">
                <div className="icon text-3xl text-blue-500">🗺️</div>
                <div>
                  <h3 className="title text-lg font-bold text-gray-900">Routing (React Router)</h3>
                  <p className="text-sm text-gray-600">Navigating between Home, Post details, and Profile pages.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="concept-card bg-white p-5 shadow-xl border-2 border-blue-100 rounded-xl"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <div className="flex items-center space-x-3">
                <div className="icon text-3xl text-blue-500">🌐</div>
                <div>
                  <h3 className="title text-lg font-bold text-gray-900">Backend Integration</h3>
                  <p className="text-sm text-gray-600">Connecting the application to a server (e.g., Firebase) for data persistence.</p>
                </div>
              </div>
            </motion.div>
            
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}