import { createContext, useContext, useEffect, useState } from "react";
import socket from "@/utils/socket";
import axiosInstance from "@/api/axiosInstance";
import { AuthContext } from "@/context/auth-context";

const InstructorChatContext = createContext();
export const useInstructorChat = () => useContext(InstructorChatContext);

export const InstructorChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({}); // ✅

  const { auth } = useContext(AuthContext);
  const currentInstructor = auth?.user?._id;

  useEffect(() => {
    if (currentInstructor) {
      socket.emit("join", currentInstructor);
    }

    socket.on("new-message", (msg) => {
      if (msg.chatId === activeChat?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // ✅ Presence listener
    socket.on("user-status", ({ userId, isOnline, lastSeen }) => {
      console.log(`User ${userId} is ${isOnline ? 'online' : 'offline'} at ${lastSeen}`);
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: { isOnline, lastSeen }
      }));
    });

    return () => {
      socket.off("new-message");
      socket.off("user-status");
    };
  }, [currentInstructor, activeChat]);

  const createOrGetChat = async (studentId) => {
    try {
      const res = await axiosInstance.post("/api/chat", {
        userId: studentId,
        instructorId: currentInstructor,
      });
      setActiveChat(res.data);
      return res.data;
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await axiosInstance.get(`/api/message/${chatId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  };

  const sendMessage = async (text) => {
    if (!activeChat || !text) return;

    try {
      const message = {
        chatId: activeChat._id,
        senderId: currentInstructor,
        text,
      };

      const res = await axiosInstance.post("/api/message", message);
      socket.emit("send-message", {
        receiverId: getReceiverId(activeChat.members),
        message: res.data,
      });

      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const getReceiverId = (members) => {
    return members.find((id) => id !== currentInstructor);
  };

  return (
    <InstructorChatContext.Provider
      value={{
        chats,
        messages,
        activeChat,
        setActiveChat,
        createOrGetChat,
        fetchMessages,
        sendMessage,
        onlineUsers // ✅
      }}
    >
      {children}
    </InstructorChatContext.Provider>
  );
};
