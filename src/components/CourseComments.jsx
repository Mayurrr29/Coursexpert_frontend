import { useEffect, useState } from "react";
import { useComments } from "../context/CommentContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import axiosInstance from "@/api/axiosInstance";
import { MessageCircle, Send, Clock, User, Shield, Heart, Reply } from "lucide-react";

const CourseComments = ({ courseId, userData, userNameforComment }) => {
  const { comments, fetchComments } = useComments();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingComments, setFetchingComments] = useState(false);
  const [likedComments, setLikedComments] = useState(new Set());
  const [showReplyForm, setShowReplyForm] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [postingReply, setPostingReply] = useState(false);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (courseId) {
      setFetchingComments(true);
      fetchComments(courseId).finally(() => setFetchingComments(false));
    }
  }, [courseId]);

  const handlePostComment = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    setLoading(true);
    try {
      await axiosInstance.post("/api/comments", {
        courseId,
        userId: userData,
        content: trimmedContent,
      });

      setContent("");
      await fetchComments(courseId);
    } catch (error) {
      console.error("Error posting comment:", error?.response?.data || error.message);
      // You could add a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = (commentId) => {
    setLikedComments(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(commentId)) {
        newLiked.delete(commentId);
      } else {
        newLiked.add(commentId);
      }
      return newLiked;
    });
    // Here you would also make an API call to like/unlike the comment
  };

  const handleReply = async (commentId) => {
    const trimmedReply = replyContent.trim();
    if (!trimmedReply) return;

    setPostingReply(true);
    try {
      await axiosInstance.post(`/api/comments/${commentId}/reply`, {
        content: trimmedReply,
      });

      setReplyContent("");
      setShowReplyForm(null);
      await fetchComments(courseId);
    } catch (error) {
      console.error("Error posting reply:", error?.response?.data || error.message);
    } finally {
      setPostingReply(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const getUserInitials = (username) => {
    if (!username) return "U";
    const names = username.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="mt-8 space-y-6 max-w-4xl pr-8">
      {/* Header */}
      <div className="flex items-center gap-2 border-b pb-4">
        <MessageCircle className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          Discussion ({comments?.length || 0})
        </h2>
      </div>

      {/* Comment input box */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-w-3xl">
        <div className="flex items-start gap-4">
          <Avatar className="w-10 h-10 ring-2 ring-blue-100 flex-shrink-0">
            <AvatarImage src={userNameforComment?.[0]?.avatar || ""} />
            <AvatarFallback className="bg-blue-500 text-white font-semibold">
              {getUserInitials(userNameforComment?.[0] || "User")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3 min-w-0">
            <Textarea
              placeholder="Share your thoughts about this course..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
              maxLength={500}
            />
            
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-gray-500">
                {content.length}/500 characters
              </span>
              
              <Button 
                onClick={handlePostComment} 
                disabled={loading || !content.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
                {loading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {fetchingComments && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {!fetchingComments && comments?.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-xl max-w-3xl">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No comments yet</h3>
            <p className="text-gray-500 text-sm">Be the first to share your thoughts!</p>
          </div>
        )}

        {comments?.map((comment) => (
          <div
            key={comment._id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 max-w-3xl"
          >
            <div className="p-4">
              {/* Comment header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Avatar className="w-9 h-9 ring-2 ring-gray-100 flex-shrink-0">
                    <AvatarImage src={comment.userId?.avatar || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                      {getUserInitials(comment.userId?.userName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {comment.userId?.userName || "Anonymous User"}
                      </h4>
                      {comment.userId?.role === "admin" && (
                        <Shield className="w-3 h-3 text-blue-600 flex-shrink-0" title="Admin" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span>{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment content */}
              <div className="mb-3">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {comment.content}
                </p>
              </div>

              {/* Comment actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleLikeComment(comment._id)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                    likedComments.has(comment._id)
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Heart 
                    className={`w-3 h-3 ${
                      likedComments.has(comment._id) ? "fill-current" : ""
                    }`} 
                  />
                  {likedComments.has(comment._id) ? "Liked" : "Like"}
                </button>

                <button
                  onClick={() => setShowReplyForm(
                    showReplyForm === comment._id ? null : comment._id
                  )}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Reply className="w-3 h-3" />
                  Reply
                </button>
              </div>

              {/* Reply form */}
              {showReplyForm === comment._id && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex gap-3">
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarImage src={userNameforComment?.[0]?.avatar || ""} />
                      <AvatarFallback className="bg-blue-500 text-white text-xs">
                        {getUserInitials(userNameforComment?.[0] || "User")}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2 min-w-0">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="min-h-[60px] resize-none text-sm"
                        maxLength={300}
                      />
                      
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs text-gray-500">
                          {replyContent.length}/300
                        </span>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowReplyForm(null);
                              setReplyContent("");
                            }}
                            className="text-xs px-3 py-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleReply(comment._id)}
                            disabled={postingReply || !replyContent.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1"
                          >
                            {postingReply ? "Posting..." : "Reply"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Reply */}
              {comment.reply?.content && (
                <div className="mt-3 ml-3 border-l-4 border-blue-200 pl-3 bg-blue-50 rounded-r-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-3 h-3 text-blue-600 flex-shrink-0" />
                    <span className="font-semibold text-blue-800 text-xs">Admin Reply</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {comment.reply.content}
                  </p>
                  {comment.reply.createdAt && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 mt-2">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span>{formatTimeAgo(comment.reply.createdAt)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseComments;