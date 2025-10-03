/* eslint-disable no-undef */ 
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. المسارات: يخبر Tailwind أين يجد كلاساتك في ملفات HTML و JSX/TSX
  content: [
    "./index.html", 
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  
  theme: {
    extend: {
      // هنا يمكنك إضافة ألوان أو خطوط مخصصة لمشروعك
    },
  },
  
  // 2. الإضافات: تفعيل DaisyUI
  plugins: [
    require("daisyui")
  ],
  

};