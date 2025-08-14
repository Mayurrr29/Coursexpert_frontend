import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { useChat } from "../../context/chat-context/ChatContext";
import { AuthContext } from "@/context/auth-context";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const ChatPage = ({ instructorId }) => {
  
  const { auth } = useContext(AuthContext);
  const user = auth?.user?._id;
  const username = auth?.user?.userName;

  const {
    messages,
    createOrGetChat,
    fetchMessages,
    sendMessage,
    getUserStatus
  } = useChat();

  const [input, setInput] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef(null);

  // Keep online/offline status
  const { isOnline, lastSeen } = getUserStatus(instructorId);

  useEffect(() => {
    const setupChat = async () => {
        setIsInitialized(false);

      try {
        if (user && instructorId ) {
          const chat = await createOrGetChat(instructorId);
          if (chat) {
            await fetchMessages(chat._id);
          }
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Chat setup error:", error);
      }
    };

    setupChat();
  }, [user, instructorId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      await sendMessage(input);
      setInput("");
    } catch (error) {
      console.error("Message sending error:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      
      {/* Header with online/offline */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
        <div className="h-10 w-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold text-lg">
          {username?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Chat with Instructor {username}
          </h2>
          <div className="flex items-center gap-1">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
              title={isOnline ? "Online" : "Offline"}
            ></span>
            {isOnline ? (
              <span className="text-sm text-green-600">Online</span>
            ) : (
              <span className="text-sm text-gray-500">
                {lastSeen
                  ? `Last seen ${dayjs(lastSeen).fromNow()}`
                  : "Not available"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-100 dark:bg-gray-950">
        {messages.length > 0 ? (
          messages.map((msg, idx) => {
            const isSender = msg.senderId === user;
            return (
              <div
                key={msg._id || idx}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs sm:max-w-sm md:max-w-md px-3 py-2 rounded-2xl text-sm shadow-sm ${
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

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
          disabled={!isInitialized}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || !isInitialized}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full disabled:bg-blue-400 disabled:cursor-not-allowed transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
