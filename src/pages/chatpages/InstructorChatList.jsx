// src/pages/chat/InstructorChatList.jsx

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { AuthContext } from "@/context/auth-context";

const InstructorChatList = () => {
  const [chats, setChats] = useState([]);
  const [students, setStudents] = useState({});
  const { auth } = useContext(AuthContext);
  const instructor = auth?.user;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axiosInstance.get(`/api/chat?userId=${instructor._id}`);
        setChats(res.data);

        // Fetch student details
        const studentIds = res.data
          .flatMap(chat => chat.members)
          .filter(id => id !== instructor._id);

        // Remove duplicates
        const uniqueStudentIds = [...new Set(studentIds)];

        const studentDetails = {};
        for (const id of uniqueStudentIds) {
          const res = await axiosInstance.get(`/api/users/${id}`); // assumes such endpoint exists
          studentDetails[id] = res.data;
        }
        setStudents(studentDetails);
      } catch (err) {
        console.error("Error fetching chats or students:", err);
      }
    };

    if (instructor?._id) {
      fetchChats();
    }
  }, [instructor]);

  const handleOpenChat = (chat) => {
    const studentId = chat.members.find(id => id !== instructor._id);
    navigate(`/chat/${studentId}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Chats with Students</h2>

      {chats.length > 0 ? (
        chats.map((chat) => {
          const studentId = chat.members.find(id => id !== instructor._id);
          const student = students[studentId];

          return (
            <div key={chat._id} className="border p-3 mb-2 rounded shadow-sm flex justify-between items-center">
              <div>
                <p className="font-medium">{student?.userName || "Student"}</p>
                <p className="text-sm text-gray-600">Chat ID: {chat._id}</p>
              </div>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => handleOpenChat(chat)}
              >
                Open Chat
              </button>
            </div>
          );
        })
      ) : (
        <p>No chats found.</p>
      )}
    </div>
  );
};

export default InstructorChatList;
