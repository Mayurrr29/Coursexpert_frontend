import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MessageCircle, Users, Filter, MoreHorizontal } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function InstructorsList({ onSelectInstructor }) {
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, online, offline
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await axiosInstance.get("/api/users/instructors");
        const instructorsData = res.data || [];
        setInstructors(instructorsData);
        setFilteredInstructors(instructorsData);
      } catch (err) {
        console.error("Error fetching instructors:", err);
        setInstructors([]);
        setFilteredInstructors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  // Filter instructors based on search and status
  useEffect(() => {
    let filtered = instructors;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(inst =>
        inst.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus === "online") {
      filtered = filtered.filter(inst => inst.isOnline);
    } else if (filterStatus === "offline") {
      filtered = filtered.filter(inst => !inst.isOnline);
    }

    setFilteredInstructors(filtered);
  }, [instructors, searchQuery, filterStatus]);

  const handleSelect = (instructorId,instructorName) => {
    if (onSelectInstructor) {
      onSelectInstructor(instructorId,);
    }
  };

  const getStatusText = (instructor) => {
    if (instructor.isOnline) {
      return { text: "Online now", color: "text-emerald-600 dark:text-emerald-400" };
    } else if (instructor.lastSeen) {
      return { 
        text: `Last seen ${dayjs(instructor.lastSeen).fromNow()}`, 
        color: "text-gray-500 dark:text-gray-400" 
      };
    } else {
      return { text: "Offline", color: "text-gray-400 dark:text-gray-500" };
    }
  };

  const onlineCount = instructors.filter(inst => inst.isOnline).length;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Instructors
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {onlineCount} of {instructors.length} online
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <MoreHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {[
              { key: "all", label: "All", count: instructors.length },
              { key: "online", label: "Online", count: onlineCount },
              { key: "offline", label: "Offline", count: instructors.length - onlineCount }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  filterStatus === key
                    ? "bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Instructors List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredInstructors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? "No instructors found" : "No instructors available"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
              {searchQuery 
                ? `No instructors match "${searchQuery}". Try a different search term.`
                : "There are no instructors available at the moment."
              }
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {filteredInstructors.map((inst, index) => {
              const status = getStatusText(inst);
              return (
                <div
                  key={inst._id}
                  onClick={() => handleSelect(inst._id,inst.userName)}
                  className="group flex items-center gap-4 p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-emerald-100 dark:hover:shadow-emerald-900/20 hover:scale-[1.02]"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: loading ? 'none' : 'fadeInUp 0.5s ease-out forwards'
                  }}
                >
                  {/* Enhanced Avatar */}
                  <div className="relative">
                    <Avatar className="h-14 w-14 ring-2 ring-white dark:ring-gray-700 shadow-lg">
                      <img
                        src={inst.avatar || `https://ui-avatars.com/api/?name=${inst.userName}&background=0ea5e9&color=fff&size=56`}
                        alt={inst.userName}
                        className="rounded-full object-cover"
                      />
                    </Avatar>
                    
                    {/* Enhanced Online Indicator */}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-3 border-white dark:border-gray-800 ${
                      inst.isOnline ? 'bg-emerald-500' : 'bg-gray-400'
                    } ${inst.isOnline ? 'animate-pulse' : ''}`}>
                      {inst.isOnline && (
                        <div className="absolute inset-0.5 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                        {inst.userName}
                      </h3>
                      {inst.isOnline && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Online
                        </span>
                      )}
                    </div>
                    <p className={`text-sm truncate ${status.color}`}>
                      {status.text}
                    </p>
                  </div>

                  {/* Action Indicator */}
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 rounded-full transition-colors">
                      <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}