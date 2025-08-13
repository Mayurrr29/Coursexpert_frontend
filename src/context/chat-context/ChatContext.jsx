import { createContext, useContext, useEffect, useState } from "react";
import socket from "@/utils/socket";
import axiosInstance from "@/api/axiosInstance";
import { AuthContext } from "@/context/auth-context";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});

  const { auth } = useContext(AuthContext);
  const currentUser = auth?.user?._id;

  useEffect(() => {
    if (!currentUser) return;

    socket.emit("join", currentUser);

    const handleNewMessage = (msg) => {
      if (msg.chatId === activeChat?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleUserStatus = ({ userId, isOnline, lastSeen }) => {
console.log(`User ${userId} is ${isOnline ? 'online' : 'offline'} at ${lastSeen}`);
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: { isOnline, lastSeen }
      }));
    };
    socket.on("new-message", handleNewMessage);
    socket.on("user-status", handleUserStatus);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("user-status", handleUserStatus);
    };
  }, [currentUser, activeChat]);

  const createOrGetChat = async (instructorId) => {
    try {
      const res = await axiosInstance.post("/api/chat", {
        userId: currentUser,
        instructorId,
      });
      setActiveChat(res.data);
      return res.data;
    } catch (err) {
      console.error("Chat error:", err);
      throw err;
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await axiosInstance.get(`/api/message/${chatId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Fetch messages error:", err);
      throw err;
    }
  };

  const sendMessage = async (text) => {
    if (!activeChat || !text) return;

    try {
      const message = {
        chatId: activeChat._id,
        senderId: currentUser,
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
      throw err;
    }
  };

  const getReceiverId = (members) => {
    return members.find((id) => id !== currentUser);
  };

  const getUserStatus = (userId) => {
    return onlineUsers[userId] || { isOnline: false, lastSeen: null };
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        activeChat,
        setActiveChat,
        createOrGetChat,
        fetchMessages,
        sendMessage,
        getUserStatus,
        onlineUsers
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};