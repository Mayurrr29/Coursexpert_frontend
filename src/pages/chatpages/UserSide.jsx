import { useState } from "react";
import ChatPage from "./ChatPage";
import InstructorsList from "./InstructorsList";

export default function UserSide() {
  const [selectedInstructorId, setSelectedInstructorId] = useState(null);
  const [selectedInstructorName,setSelectedInstructorName]=useState(null);
  return (
    <div className="flex h-screen">
      {/* Left side - Instructors list */}
      <div className="w-64 border-r border-border overflow-y-auto">
        {/* w-64 = fixed 16rem (~256px) */}
        <InstructorsList onSelectInstructor={setSelectedInstructorId} onSelectInstructorName={setSelectedInstructorName} />
      </div>

      {/* Right side - Chat (takes full remaining width) */}
      <div className="flex-1">
        {selectedInstructorId ? (
          <ChatPage instructorId={selectedInstructorId}  instructorName={selectedInstructorName}/>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
