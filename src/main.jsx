import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/auth-context/index.jsx";
import InstructorProvider from "./context/instructor-context/index.jsx";
import StudentProvider from "./context/student-context/index.jsx";
import { CommentProvider } from "./context/CommentContext.jsx";
import { ChatProvider } from "./context/chat-context/ChatContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure this line is included
import { InstructorChatProvider } from "./context/chat-context/InstructorChatContext.jsx";

createRoot(document.getElementById("root")).render(
  
  <BrowserRouter>
    <AuthProvider>
      <InstructorProvider>
        <StudentProvider>
          <CommentProvider >
           <ChatProvider>
            <InstructorChatProvider>
               <App />
   <ToastContainer
            position="top-center"
            autoClose={3000}
            pauseOnHover
            theme="light"
            newestOnTop
          />
            </InstructorChatProvider>
</ChatProvider>
          </CommentProvider>
        </StudentProvider>
      </InstructorProvider>
    </AuthProvider>
  </BrowserRouter>
);
