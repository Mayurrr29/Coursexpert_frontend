import { createContext, useContext, useEffect, useState } from "react";
import socket from "../utils/socket";
const CommentContext = createContext();
import axiosInstance from "@/api/axiosInstance"; // adjust the path if different

export const useComments = () => useContext(CommentContext);

export const CommentProvider = ({ children, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [cmtAdmin,setCmtAdmin]=useState([]);
  useEffect(() => {
    // Join room for this user (for admin replies)
    if (currentUser?._id) {
      socket.emit("join-room", currentUser._id);
    }

    // Listen for new comment (admin view)
    socket.on("new-comment", (comment) => {
      setComments((prev) => [comment, ...prev]);
    });

    // Listen for admin reply (user view)
    socket.on("admin-replied", (updatedComment) => {
      setComments((prev) =>
        prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
      );
    });

    return () => {
      socket.off("new-comment");
      socket.off("admin-replied");
    };
  }, [currentUser]);

 const fetchComments = async (courseId) => {
  try {
    const res = await axiosInstance.get(`/api/comments/course/${courseId}`);
    setComments(res.data);
  } catch (error) {
    console.error("Error fetching comments:", error);
    // Handle error (optional)
  }
};
const fetchAllComments = async () => {
  try {
    const res = await axiosInstance.get(`/api/comments/allcomments`);
    setCmtAdmin(res.data);
  } catch (error) {
    console.error("Error fetching all comments:", error);
    // Optionally handle error UI or notifications here
  }
};
  return (
    <CommentContext.Provider value={{ comments,cmtAdmin, fetchComments,fetchAllComments}}>
      {children}
    </CommentContext.Provider>
  );
};
