// src/pages/chat/InstructorsList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function InstructorsList() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await axiosInstance.get("/api/users/instructors");
        setInstructors(res.data || []);
      } catch (err) {
        console.error("Error fetching instructors:", err);
        setInstructors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const handleSelect = (instructorId) => {
    navigate(`/chat/${instructorId}`);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 shadow-md">
        <h2 className="text-lg font-bold">Instructors</h2>
      </div>

      {/* Chat List Background */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : instructors.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No instructors found</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {instructors.map((inst) => (
              <li
                key={inst._id}
                onClick={() => handleSelect(inst._id)}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  <img
                    src={inst.avatar || `https://ui-avatars.com/api/?name=${inst.userName}`}
                    alt={inst.userName}
                    className="rounded-full object-cover"
                  />
                </Avatar>

                {/* Name + Last Message */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-900 dark:text-white">
                    {inst.userName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {inst.isOnline
                      ? "Online now"
                      : inst.lastSeen
                      ? `Last seen ${new Date(inst.lastSeen).toLocaleString()}`
                      : "Offline"}
                  </p>
                </div>

                {/* Online indicator */}
                {inst.isOnline && (
                  <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
