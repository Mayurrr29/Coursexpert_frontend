// src/pages/chat/StudentList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { Avatar } from "@/components/ui/avatar"; // If you have shadcn Avatar
import { Skeleton } from "@/components/ui/skeleton"; // For loading

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axiosInstance.get("/api/users/students");
        setStudents(res.data);
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSelect = (studentId) => {
    navigate(`/instructor/chat/${studentId}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Students</h2>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      ) : students.length > 0 ? (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {students.map((student) => (
            <li
              key={student._id}
              onClick={() => handleSelect(student._id)}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-lg"
            >
              <Avatar className="h-10 w-10">
                <img
                  src={student.avatar || `https://ui-avatars.com/api/?name=${student.userName}`}
                  alt={student.userName}
                  className="rounded-full object-cover"
                />
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{student.userName}</p>
                <p className="text-xs text-gray-500 truncate">
                  {student.lastMessage || "Tap to start chatting"}
                </p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {student.lastSeen ? new Date(student.lastSeen).toLocaleDateString() : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 py-4">No students found</div>
      )}
    </div>
  );
};

export default StudentList;
