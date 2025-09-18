import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { useChat } from "../../context/chat-context/ChatContext";
import { AuthContext } from "@/context/auth-context";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Send, ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
dayjs.extend(relativeTime);

const ChatPage = ({ instructorId,instructorName, onBack }) => {
  const { auth } = useContext(AuthContext);
  const user = auth?.user?._id;
  const username = instructorName;

  const {
    messages,
    createOrGetChat,
    fetchMessages,
    sendMessage,
    getUserStatus
  } = useChat();

  const [input, setInput] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Keep online/offline status
  const { isOnline, lastSeen } = getUserStatus(instructorId);

  useEffect(() => {
    const setupChat = async () => {
      setIsInitialized(false);

      try {
        if (user && instructorId) {
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
    
    setIsTyping(true);
    try {
      await sendMessage(input);
      setInput("");
    } catch (error) {
      console.error("Message sending error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageTime = (timestamp) => {
    const now = dayjs();
    const messageTime = dayjs(timestamp);
    
    if (now.diff(messageTime, 'day') === 0) {
      return messageTime.format('HH:mm');
    } else if (now.diff(messageTime, 'day') === 1) {
      return `Yesterday ${messageTime.format('HH:mm')}`;
    } else {
      return messageTime.format('MMM D, HH:mm');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      
      {/* Enhanced Header */}
      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            )}
            
            {/* Enhanced Avatar */}
            <div className="relative">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {username?.[0]?.toUpperCase()}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${
                isOnline ? 'bg-emerald-500' : 'bg-gray-400'
              }`}></div>
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 dark:text-white text-lg">
                {username}
              </h2>
              <div className="flex items-center gap-2 text-sm">
                {isOnline ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Online now
                  </span>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    {lastSeen
                      ? `Last seen ${dayjs(lastSeen).fromNow()}`
                      : "Not available"}
                  </span>
                )}
                {isTyping && (
                  <span className="text-blue-600 dark:text-blue-400 text-xs animate-pulse">
                    typing...
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <Video className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

     <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gradient-to-b from-transparent to-white/30 dark:to-gray-900/30">
        {!isInitialized ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, idx) => {
            const isSender = msg.senderId === user;
           const showTime = idx === 0 || 
  dayjs(msg.createdAt).diff(dayjs(messages[idx - 1]?.createdAt), 'hour') >= 1;
            const isConsecutive = idx > 0 && 
              messages[idx - 1]?.senderId === msg.senderId && 
              dayjs(msg.createdAt).diff(dayjs(messages[idx - 1]?.createdAt), 'day') >=1;
       // ADDED: New logic to detect last message in a group
const isLastInGroup =
  idx === messages.length - 1 ||
  messages[idx + 1]?.senderId !== msg.senderId ||
  dayjs(messages[idx + 1]?.createdAt).diff(dayjs(msg.createdAt), 'day') >= 1;

            return (
              <div key={msg._id || idx} className="space-y-2">
                {showTime && (
                  <div className="text-center">
                    <span className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-600 dark:text-gray-400 shadow-sm">
                      {formatMessageTime(msg.createdAt)}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${isSender ? "justify-end" : "justify-start"} group`}>
                  <div className={`flex items-start gap-2 max-w-[75%] sm:max-w-md ${isSender ? "flex-row-reverse" : "flex-row"}`}>
                    
                    {/* Avatar for non-sender messages (only on last message of group) */}
                {!isSender && isLastInGroup && (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
    {username?.[0]?.toUpperCase()}
  </div>
)}

{/* Above-avatar spacing logic */}
<div
  className={`relative ${
    !isSender && !isLastInGroup && messages[idx + 1]?.senderId === msg.senderId
      ? "ml-10"
      : ""
  }`}
>
  <div
    className={`px-4 py-3 text-sm shadow-md transition-all duration-200 group-hover:shadow-lg ${
      isSender
        ? `bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-lg`
        : `bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200/60 dark:border-gray-700/60 rounded-2xl rounded-bl-lg`
    }`}
  >
                        <p className="break-words leading-relaxed">{msg.text}</p>
                        
                        {/* Message metadata */}
                        <div className={`flex items-center justify-end gap-1 mt-2 ${
                          isSender ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          <span className="text-[10px]">
                            {dayjs(msg.createdAt).format("HH:mm")}
                          </span>
                          {isSender && (
                            <div className="flex">
                              {/* Message status indicators */}
                              <div className={`w-3 h-3 ${isSender ? 'text-blue-200' : 'text-gray-400'}`}>
                                {/* Double tick for sent */}
                                <svg viewBox="0 0 16 11" className="w-full h-full fill-current">
                                  <path d="M11.071.653A.5.5 0 0 0 10.357.653L5.357 5.653A.5.5 0 0 0 5.357 6.367L10.357 11.367A.5.5 0 0 0 11.071 11.367L11.071 10.653L6.784 6.367L11.071 2.081V.653Z" />
                                  <path d="M6.071.653A.5.5 0 0 0 5.357.653L.357 5.653A.5.5 0 0 0 .357 6.367L5.357 11.367A.5.5 0 0 0 6.071 11.367V10.653L1.784 6.367L6.071 2.081V.653Z" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {username?.[0]?.toUpperCase()}
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Start your conversation with {username}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Send a message to begin chatting
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none shadow-sm transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
              disabled={!isInitialized}
              style={{
                minHeight: '48px',
                maxHeight: '120px',
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          
          <button
            onClick={handleSend}
            disabled={!input.trim() || !isInitialized}
            className={`p-3 rounded-full transition-all duration-200 shadow-lg ${
              input.trim() && isInitialized
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-200 dark:shadow-blue-900/30 hover:shadow-xl hover:scale-105"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;