import CourseComments from "@/components/CourseComments";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  BookOpen,
  Clock,
  Users,
  Award,
  Star,
  Download,
  Share2,
  MessageCircle,
  Eye,
  Target,
  Calendar
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [lectureClickable, setLectureClickable] = useState(true);
  
  const { id } = useParams();
  const userData = auth?.user?._id || {};
  const courseIdd = studentCurrentCourseProgress?.courseDetails?._id || id;
  const userNameforComment = [auth?.user?.userName || "User"];

  // Calculate course statistics
  const totalLectures = studentCurrentCourseProgress?.courseDetails?.curriculum?.length || 0;
  const completedLectures = studentCurrentCourseProgress?.progress?.filter(p => p.viewed)?.length || 0;
  const progressPercentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
  
  // Calculate estimated total duration (mock data - you can replace with actual duration)
  const estimatedDuration = totalLectures * 15; // Assuming 15 minutes per lecture

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        // Course completed logic
        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);
          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[lastIndexOfViewedAsTrue + 1]
          );
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  const handleLectureClick = (lecture) => {
    if (lectureClickable) {
      setCurrentLecture(lecture);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: studentCurrentCourseProgress?.courseDetails?.title,
        text: 'Check out this amazing course!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.1}
        />
      )}
      
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-[#1c1d1f] to-gray-800 text-white">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1c1d1f] to-gray-800 border-b border-gray-600 shadow-lg">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate("/student-courses")}
              className="text-white bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
              variant="ghost"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-white">
                {studentCurrentCourseProgress?.courseDetails?.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-blue-400" />
                  {progressPercentage}% Complete
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-green-400" />
                  {completedLectures}/{totalLectures} Lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  ~{estimatedDuration} mins
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setIsSideBarOpen(!isSideBarOpen)}
              className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              {isSideBarOpen ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="flex flex-1">
          {/* Main Content Area */}
          <div
            className={`flex-1 ${
              isSideBarOpen ? "mr-[420px]" : ""
            } transition-all duration-300 flex flex-col`}
          >
            {/* Video Player Section */}
            <div className="relative bg-black">
              <VideoPlayer
                width="100%"
                height="500px"
                url={currentLecture?.videoUrl}
                onProgressUpdate={setCurrentLecture}
                progressData={currentLecture}
              />
              
              {/* Video Overlay Info */}
              <div className="absolute bottom-20 left-4 bg-black bg-opacity-70 rounded-lg p-3">
                <h3 className="text-white font-semibold text-lg">
                  {currentLecture?.title || "Select a lesson"}
                </h3>
                <p className="text-gray-300 text-sm">
                  Lesson {studentCurrentCourseProgress?.courseDetails?.curriculum?.findIndex(
                    item => item._id === currentLecture?._id
                  ) + 1 || 0} of {totalLectures}
                </p>
              </div>
            </div>

            {/* Lesson Details */}
            <div className="p-6 bg-gradient-to-r from-[#1c1d1f] to-gray-800 border-b border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-3 text-white">
                    {currentLecture?.title || "Welcome to the Course"}
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {currentLecture?.description || 
                     studentCurrentCourseProgress?.courseDetails?.description ||
                     "Select a lesson from the sidebar to begin your learning journey."}
                  </p>
                </div>
                
                {currentLecture && (
                  <div className="flex items-center gap-2 bg-gray-700 rounded-full px-4 py-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">
                      {currentLecture?.duration || "15 min"}
                    </span>
                  </div>
                )}
              </div>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t border-gray-600">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">{totalLectures} Lessons</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-orange-400" />
                  <span className="text-gray-300">
                    {studentCurrentCourseProgress?.courseDetails?.students?.length || 0} Students
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">
                    {studentCurrentCourseProgress?.courseDetails?.rating || "4.5"} Rating
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="text-gray-300">Updated Recently</span>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex-1 bg-gray-50">
              <CourseComments 
                userData={userData} 
                courseId={courseIdd} 
                userNameforComment={userNameforComment}
              />
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div
            className={`fixed top-[96px] right-0 bottom-0 w-[420px] bg-gradient-to-b from-[#1c1d1f] to-gray-800 border-l border-gray-600 shadow-2xl transition-all duration-300 ${
              isSideBarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="h-full flex flex-col"
            >
              <TabsList className="grid bg-gray-800 w-full grid-cols-2 p-1 h-14 rounded-none border-b border-gray-600">
                <TabsTrigger
                  value="content"
                  className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-none h-full font-medium"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger
                  value="overview"
                  className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-none h-full font-medium"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-3">
                    {/* Course Progress Summary */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-semibold">Course Progress</span>
                        <span className="text-white font-bold">{progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                        <div 
                          className="bg-white rounded-full h-2 transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-white text-sm mt-2">
                        {completedLectures} of {totalLectures} lessons completed
                      </p>
                    </div>

                    {/* Lecture List */}
                    {studentCurrentCourseProgress?.courseDetails?.curriculum.map((item, index) => {
                      const isCompleted = studentCurrentCourseProgress?.progress?.find(
                        (progressItem) => progressItem.lectureId === item._id
                      )?.viewed;
                      const isActive = currentLecture?._id === item._id;

                      return (
                        <div
                          key={item._id}
                          onClick={() => handleLectureClick(item)}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                            isActive 
                              ? "bg-blue-600 shadow-lg transform scale-105" 
                              : isCompleted
                                ? "bg-green-700 hover:bg-green-600"
                                : "bg-gray-700 hover:bg-gray-600"
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <Check className="h-5 w-5 text-white bg-green-500 rounded-full p-1" />
                            ) : (
                              <Play className="h-5 w-5 text-white" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-300 font-medium">
                                Lesson {index + 1}
                              </span>
                              <span className="text-xs text-gray-400">
                                {item.duration || "15 min"}
                              </span>
                            </div>
                            <h4 className="text-white font-medium text-sm leading-tight">
                              {item.title}
                            </h4>
                          </div>
                          
                          {isActive && (
                            <div className="w-2 h-8 bg-white rounded-full"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="overview" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-6">
                    {/* Course Info */}
                    <div>
                      <h2 className="text-xl font-bold mb-4 text-white flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                        About this course
                      </h2>
                      <p className="text-gray-300 leading-relaxed">
                        {studentCurrentCourseProgress?.courseDetails?.description}
                      </p>
                    </div>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-700 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {totalLectures}
                        </div>
                        <div className="text-sm text-gray-300">Lessons</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {Math.floor(estimatedDuration / 60)}h {estimatedDuration % 60}m
                        </div>
                        <div className="text-sm text-gray-300">Duration</div>
                      </div>
                    </div>

                    {/* Instructor Info */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-white flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-400" />
                        Instructor
                      </h3>
                      <div className="flex items-center space-x-3 bg-gray-700 rounded-lg p-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {studentCurrentCourseProgress?.courseDetails?.instructorName?.[0] || "I"}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {studentCurrentCourseProgress?.courseDetails?.instructorName || "Course Instructor"}
                          </div>
                          <div className="text-gray-400 text-sm">Expert Educator</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                      <Button 
                        onClick={handleShare}
                        variant="outline" 
                        className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-700"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Course
                      </Button>
                      <Button 
                        onClick={() => setActiveTab("content")}
                        variant="outline" 
                        className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-700"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        View Comments
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Dialogs */}
        <Dialog open={lockCourse}>
          <DialogContent className="sm:w-[425px] bg-gray-800 border-gray-600">
            <DialogHeader>
              <DialogTitle className="text-white">Access Restricted</DialogTitle>
              <DialogDescription className="text-gray-300">
                Please purchase this course to get access to all lessons and features.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog open={showCourseCompleteDialog}>
          <DialogContent showOverlay={false} className="sm:w-[500px] bg-gradient-to-r from-green-600 to-blue-600 border-none text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center mb-2">
                🎉 Congratulations! 🎉
              </DialogTitle>
              <DialogDescription className="flex flex-col gap-4 text-center">
                <div>
                  <Award className="w-16 h-16 mx-auto mb-3 text-yellow-300" />
                  <Label className="text-lg text-white">
                    You have successfully completed the course!
                  </Label>
                  <p className="text-gray-200 mt-2">
                    You've mastered all {totalLectures} lessons. Great job on your learning journey!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Button 
                    onClick={() => navigate("/student-courses")}
                    className="bg-white text-gray-800 hover:bg-gray-100 flex-1"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    My Courses
                  </Button>
                  <Button 
                    onClick={handleRewatchCourse}
                    variant="outline"
                    className="bg-white text-gray-800 hover:bg-gray-100 flex-1"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Rewatch Course
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default StudentViewCourseProgressPage;