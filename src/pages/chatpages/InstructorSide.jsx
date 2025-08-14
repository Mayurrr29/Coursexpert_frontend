import { useState } from "react";
import InstructorChatPage from "./InstructorChatPage";
import StudentsList from "./StudentList"; // Assuming you have a StudentsList component 
export default function InstructorSide() {
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  return (
    <div className="flex h-screen">
      {/* Left side - Students list */}
      <div className="w-64 border-r border-border overflow-y-auto">
        <StudentsList onSelectStudent={setSelectedStudentId} />
      </div>

      {/* Right side - Chat */}
      <div className="flex-1">
        {selectedStudentId ? (
          <InstructorChatPage studentId={selectedStudentId} />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
