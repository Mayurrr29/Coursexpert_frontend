import { useEffect, useState } from "react";
import { useComments } from "../context/CommentContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axiosInstance";

const AdminCommentPanel = () => {
  const { cmtAdmin, fetchAllComments } = useComments();
  const [replyText, setReplyText] = useState({});
  const [openCourse, setOpenCourse] = useState(null); // To track expanded course

  useEffect(() => {
    fetchAllComments();
  }, [replyText]);

  const handleReply = async (commentId) => {
    try {
      await axiosInstance.patch(`api/comments/${commentId}/reply`, {
        content: replyText[commentId],
      });

      setReplyText(prev => ({
        ...prev,
        [commentId]: "",
      }));
    } catch (error) {
      console.error("Error sending reply:", error.response?.data || error.message);
    }
  };

  // Group comments by courseId
  const groupedByCourse = cmtAdmin.reduce((acc, comment) => {
    const courseId = comment.courseId?._id;
    if (!acc[courseId]) {
      acc[courseId] = {
        courseTitle: comment.courseId?.title || "Unknown Course",
        comments: [],
      };
    }
    acc[courseId].comments.push(comment);
    return acc;
  }, {});

  const toggleCourse = (courseId) => {
    setOpenCourse(prev => (prev === courseId ? null : courseId));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">All Course Comments</h2>

      {Object.entries(groupedByCourse).map(([courseId, { courseTitle, comments }]) => (
        <div key={courseId} className="border rounded-md bg-white shadow">
          <button
            className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 font-medium text-lg"
            onClick={() => toggleCourse(courseId)}
          >
            {openCourse === courseId ? "▼" : "▶"} Course: {courseTitle}
          </button>

          {openCourse === courseId && (
            <div className="p-4 space-y-4">
              {comments.map((c) => (
                <div key={c._id} className="p-3 border rounded-md bg-gray-50 space-y-1">
                  <p><strong>User:</strong> {c.userId?.userName || "Unknown User"}</p>
                  <p><strong>Comment:</strong> {c.content}</p>
                  <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</p>

                  {!c.reply?.content ? (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Write admin reply..."
                        value={replyText[c._id] || ""}
                        onChange={(e) =>
                          setReplyText({ ...replyText, [c._id]: e.target.value })
                        }
                      />
                      <Button onClick={() => handleReply(c._id)}>Send Reply</Button>
                    </div>
                  ) : (
                    <div className="border-l-4 border-gray-300 pl-2 text-sm">
                      <p className="font-semibold text-gray-600">Replied:</p>
                      <p>{c.reply.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminCommentPanel;
