# 🎨 CourseXpert Frontend

This is the **frontend** of CourseXpert – a modern Learning Management System (LMS).  
It provides a responsive and interactive UI for students, instructors, and admins to manage courses, payments, and live communication.  

Deployed Live: 🌐 [Vercel](https://coursexpert.vercel.app)

---

## 🚀 Features (Frontend)

- 👤 Authentication (Login/Signup with JWT)  
- 🏫 User roles: Student, Instructor, Admin  
- 📖 Browse and enroll in courses  
- 🎥 Video lectures & resources integrated via **Cloudinary**  
- 💳 **PayPal payment integration** for premium courses  
- 💬 **Live chat and real-time commenting** using **Socket.IO client**  
- 📊 Progress tracking for students  
- 🎨 Modern UI using **Shadcn + TailwindCSS**  
- 🌐 Fully responsive across devices  

---

## 🛠️ Tech Stack (Frontend)

- ⚛️ React.js  
- ⚡ Context API (for state management)  
- 🎨 Shadcn + TailwindCSS (UI design)  
- 🔗 React Router DOM (routing)  
- 🌐 Axios (API requests)  
- 💬 Socket.IO Client (real-time chat & comments)  
- 💳 PayPal SDK (payment integration)  
- 🚀 Deployed on **Vercel**  

---

## ⚡ Getting Started (Frontend)

### 1️⃣ Install dependencies
```bash
cd client
npm install

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
