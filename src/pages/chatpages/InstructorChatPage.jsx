// src/pages/chat/InstructorChatPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { useInstructorChat } from "@/context/chat-context/InstructorChatContext";
import { AuthContext } from "@/context/auth-context";
import dayjs from "dayjs";

const InstructorChatPage = () => {
  const { studentId } = useParams();
  const { auth } = useContext(AuthContext);
  const instructor = auth?.user?._id;
  const instructorName = auth?.user?.userName;

  const {
    messages,
    createOrGetChat,
    fetchMessages,
    sendMessage,
  } = useInstructorChat();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const setupChat = async () => {
      if (instructor && studentId) {
        const chat = await createOrGetChat(studentId);
        if (chat) {
          await fetchMessages(chat._id);
        }
      }
    };
    setupChat();
  }, [instructor, studentId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
        <div className="h-10 w-10 flex items-center justify-center bg-green-600 text-white rounded-full font-bold text-lg">
          S
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Chat with Student
          </h2>
          <span className="text-sm text-gray-500">Active now</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-100 dark:bg-gray-950">
        {messages.length > 0 ? (
          messages.map((msg, idx) => {
            const isSender = msg.senderId === instructor;
            return (
              <div
                key={msg._id || idx}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-3 py-2 rounded-2xl text-sm shadow-sm ${
                    isSender
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                  }`}
                >
                  {msg.text}
                  <div className="text-[10px] opacity-70 mt-1 text-right">
                    {dayjs(msg.createdAt).format("HH:mm")}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-6 text-sm">
            No messages yet. Start the conversation!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-white"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full disabled:bg-green-400 disabled:cursor-not-allowed transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default InstructorChatPage;
