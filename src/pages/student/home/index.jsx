"use client";

import { useState, useContext, useEffect, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import { courseCategories } from "@/config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import {
  fetchStudentViewCourseListService,
  checkCoursePurchaseInfoService,
} from "@/services";
import {
  Play,
  Star,
  Users,
  Clock,
  BookOpen,
  Award,
  TrendingUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  Globe,
  Zap,
  CheckCircle,
  Mail,
  Heart,
  Share2,
  Bookmark,
  Filter,
  Search,
  User,
} from "lucide-react";

// Enhanced Course Card with animations and better UX
const CourseCard = memo(function CourseCard({ course, onNavigate }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onNavigate(course._id)}
      className="group bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-2xl hover:border-purple-500/50 transition-all duration-500 cursor-pointer backdrop-blur-sm overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
    >
      <div className="relative overflow-hidden">
        <img
          src={course?.image || "/placeholder-course.jpg"}
          alt={course?.title || "Course image"}
          loading="lazy"
          className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg">
          ₹{course?.pricing ?? "—"}
        </Badge>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors">
            <Play className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked((v) => !v);
            }}
            className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0"
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? "text-red-500" : "text-white"
              }`}
            />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setIsBookmarked((v) => !v);
            }}
            className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0"
          >
            <Bookmark
              className={`w-4 h-4 ${
                isBookmarked ? "text-yellow-500" : "text-white"
              }`}
            />
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors truncate">
              {course?.title || "Untitled Course"}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-300 text-sm font-medium">
                {course?.instructorName || "Instructor"}
              </span>
            </div>
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-400 ml-1">(4.8)</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>2.4k</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>12h</span>
              </div>
            </div>
          </div> */}

          <div className="flex gap-2">
            <Badge className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
              Beginner
            </Badge>
            <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">
              Certificate
            </Badge>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(course._id);
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 group"
          >
            <span>Explore Course</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

// Enhanced Category Card
const CategoryCard = memo(function CategoryCard({ category, onClick }) {
  const icons = {
    "web-development": Globe,
    "data-science": TrendingUp,
    "mobile-development": Zap,
    design: Sparkles,
    business: Target,
    marketing: Users,
  };

  const IconComponent = icons[category.id] || BookOpen;

  return (
    <Card
      onClick={() => onClick(category.id)}
      className="group cursor-pointer bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 backdrop-blur-sm"
    >
      <CardContent className="p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-colors">
            <IconComponent className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
          </div>
        </div>
        <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
          {category.label}
        </h3>
        <p className="text-sm text-gray-400 mt-2">150+ courses</p>
      </CardContent>
    </Card>
  );
});

function StudentHomePage() {
  const { auth } = useContext(AuthContext);
  const coursesSectionRef = useRef(null);
  const navigate = useNavigate();

  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [heroTextIndex, setHeroTextIndex] = useState(0);

  const heroTexts = [
    "Master Skills, Build Your Future",
    "Learn from Industry Experts",
    "Transform Your Career Today",
    "Unlock Your Potential",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchAllStudentViewCourses(currentPage = 1) {
    setLoading(true);
    try {
      const query = `page=${currentPage}`;
      const response = await fetchStudentViewCourseListService(query);

      if (response?.success) {
        setStudentViewCoursesList(response?.data || []);
        if (response?.totalPages) {
          setTotalPages(response.totalPages);
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses(page);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleNavigateToCoursesPage(categoryId) {
    try {
      sessionStorage.removeItem("filters");
      sessionStorage.setItem(
        "filters",
        JSON.stringify({ category: [categoryId] })
      );
    } catch {
      /* no-op for SSR */
    }
    navigate("/courses");
  }

  async function handleCourseNavigate(courseId) {
    if (!courseId || !auth?.user?._id) return;
    try {
      const response = await checkCoursePurchaseInfoService(
        courseId,
        auth.user._id
      );
      if (response?.success) {
        navigate(
          response.data
            ? `/course-progress/${courseId}`
            : `/course/details/${courseId}`
        );
      }
    } catch (error) {
      console.error("Error checking course purchase info:", error);
    }
  }

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Enhanced Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-pink-900/30 opacity-50" />
          </div>

          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 10 + 10}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
            <div className="mb-8">
              <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Welcome to the Future of Learning
              </Badge>
            </div>

            <h1 className="text-6xl lg:text-8xl font-bold leading-tight mb-8">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text">
                {heroTexts[heroTextIndex]}
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join over{" "}
              <span className="text-purple-400 font-semibold">
                50,000+ learners
              </span>{" "}
              worldwide and unlock your potential with our premium courses
              designed by industry experts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                onClick={() => navigate("/courses")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-4 text-lg shadow-2xl"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Learning Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  coursesSectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-4 text-lg shadow-2xl"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Courses
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "50K+", label: "Students", icon: Users },
                { number: "1.2K+", label: "Instructors", icon: Award },
                { number: "500+", label: "Courses", icon: BookOpen },
                { number: "95%", label: "Success Rate", icon: TrendingUp },
              ].map((stat, i) => {
                const StatIcon = stat.icon;
                return (
                  <div key={i} className="group">
                    <div className="mb-2 flex justify-center">
                      <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-colors">
                        <StatIcon className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enhanced Course Categories */}
        <section className="py-20 px-6 lg:px-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent" />
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-4">
                <Filter className="w-4 h-4 mr-2" />
                Categories
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Explore{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Learning Paths
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Choose from our carefully curated categories to find the perfect
                learning journey for your goals
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {courseCategories.map((category) => (
                <div key={category.id}>
                  <CategoryCard
                    category={category}
                    onClick={handleNavigateToCoursesPage}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Featured Courses */}
        <section
          ref={coursesSectionRef}
          className="py-20 px-6 lg:px-20 bg-gradient-to-b from-gray-900/50 to-transparent"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30 mb-4">
                <Star className="w-4 h-4 mr-2" />
                Featured
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Premium{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">
                  Courses
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Hand-picked courses from our top-rated instructors, designed to
                accelerate your learning journey
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 backdrop-blur-sm"
                />
              </div>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800/50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card
                    key={i}
                    className="bg-gray-800/50 border-gray-700/50 animate-pulse"
                  >
                    <div className="h-52 bg-gray-700/50 rounded-t-2xl" />
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-700/50 rounded mb-2" />
                      <div className="h-3 bg-gray-700/50 rounded w-2/3 mb-4" />
                      <div className="h-8 bg-gray-700/50 rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {studentViewCoursesList.length ? (
                  studentViewCoursesList.map((course) => (
                    <CourseCard
                      key={course._id}
                      course={course}
                      onNavigate={handleCourseNavigate}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-400 mb-2">
                      No Courses Found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Check back later for new courses or try adjusting your
                      search
                    </p>
                    <Button
                      onClick={() => navigate("/courses")}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Browse All Courses
                    </Button>
                  </div>
                )}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-16 gap-4">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    coursesSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800/50 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, i) => {
                      const pageNum = i + 1;
                      const isActive = page === pageNum;
                      return (
                        <Button
                          key={pageNum}
                          variant={isActive ? "default" : "outline"}
                          onClick={() => setPage(pageNum)}
                          className={
                            isActive
                              ? "bg-purple-600 hover:bg-purple-700"
                              : "border-gray-600 text-gray-300 hover:bg-gray-800/50"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    coursesSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800/50 disabled:opacity-30"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6 lg:px-20 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-indigo-900/30 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16">
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30 mb-4">
                <TrendingUp className="w-4 h-4 mr-2" />
                Our Impact
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Trusted by{" "}
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
                  Thousands
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "50,000+", label: "Active Learners", icon: Users },
                { number: "1,200+", label: "Expert Instructors", icon: Award },
                { number: "95%", label: "Completion Rate", icon: CheckCircle },
                { number: "4.8/5", label: "Average Rating", icon: Star },
              ].map((stat, i) => {
                const StatIcon = stat.icon;
                return (
                  <Card
                    key={i}
                    className="bg-white/5 backdrop-blur-sm border-white/10 text-center hover:bg-white/10 transition-all duration-300"
                  >
                    <CardContent className="p-8">
                      <div className="mb-4 flex justify-center">
                        <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl">
                          <StatIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="text-4xl font-bold text-white mb-2">
                        {stat.number}
                      </div>
                      <div className="text-gray-300 font-medium">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6 lg:px-20 bg-gradient-to-b from-gray-900/50 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border-pink-500/30 mb-4">
                <Heart className="w-4 h-4 mr-2" />
                Success Stories
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                What Our{" "}
                <span className="bg-gradient-to-r from-pink-400 to-rose-400 text-transparent bg-clip-text">
                  Students Say
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Real transformations from our global community of learners
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Aarav Mehta",
                  role: "Frontend Developer @ TechCorp",
                  quote:
                    "The courses here completely transformed my career. I went from a complete beginner to landing my dream job at a top tech company in just 8 months.",
                  rating: 5,
                  initials: "AM",
                },
                {
                  name: "Priya Sharma",
                  role: "UX Designer @ DesignHub",
                  quote:
                    "I've tried multiple platforms, but this one stands out. The mentor support and real-world projects helped me build an incredible portfolio.",
                  rating: 5,
                  initials: "PS",
                },
                {
                  name: "Rohan Iyer",
                  role: "Data Scientist @ Analytics Pro",
                  quote:
                    "As a working professional, the flexibility was perfect. I could learn at my own pace and immediately apply concepts at work.",
                  rating: 5,
                  initials: "RI",
                },
              ].map((t, i) => {
                const stars = Array.from({ length: t.rating });
                return (
                  <Card
                    key={i}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm hover:scale-105"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center gap-1 mb-4">
                        {stars.map((_, j) => (
                          <Star key={j} className="w-5 h-5 text-yellow-400" />
                        ))}
                      </div>

                      <blockquote className="text-gray-300 mb-6 italic leading-relaxed">
                        “{t.quote}”
                      </blockquote>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {t.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {t.name}
                          </div>
                          <div className="text-sm text-gray-400">{t.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 px-6 lg:px-20 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-indigo-900/30 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative">
            <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30 mb-6">
              <Mail className="w-4 h-4 mr-2" />
              Stay Updated
            </Badge>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Never Miss a{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                Learning Opportunity
              </span>
            </h2>

            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Get exclusive access to new courses, special discounts, and expert
              learning tips delivered straight to your inbox.
            </p>

            <div className="max-w-md mx-auto mb-16">
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
                  />
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-white border-0 shadow-lg">
                  Subscribe
                </Button>
              </div>

              <p className="text-sm text-gray-400">
                🔒 We respect your privacy. Unsubscribe at any time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Weekly Tips", desc: "Expert learning strategies" },
                { icon: Star, title: "New Courses", desc: "Be the first to know" },
                { icon: Award, title: "Exclusive Offers", desc: "Subscriber-only discounts" },
              ].map((item, i) => {
                const ItemIcon = item.icon;
                return (
                  <div key={i} className="text-center">
                    <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-4">
                      <ItemIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 sm:col-span-2 md:col-span-1">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl mr-3">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                      CourseXpert
                    </span>
                  </h2>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Empowering your future through quality education and
                  continuous learning. Join our global community of learners.
                </p>
                <div className="flex gap-4">
                  {[
                    { icon: Share2, href: "#", label: "Twitter" },
                    { icon: Users, href: "#", label: "LinkedIn" },
                    { icon: Heart, href: "#", label: "Instagram" },
                    { icon: Globe, href: "#", label: "Facebook" },
                  ].map((social, i) => {
                    const SocialIcon = social.icon;
                    return (
                      <a
                        key={i}
                        href={social.href}
                        aria-label={social.label}
                        className="p-3 bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all duration-300 group"
                      >
                        <SocialIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Learn</h3>
                <ul className="space-y-4">
                  {[
                    { name: "Browse Courses", href: "/courses" },
                    { name: "Free Tutorials", href: "/tutorials" },
                    { name: "Skill Assessments", href: "/assessments" },
                    { name: "Certificates", href: "/certificates" },
                    { name: "Learning Paths", href: "/paths" },
                  ].map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-purple-400 transition-colors flex items-center group"
                      >
                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-6">
                  Support
                </h3>
                <ul className="space-y-4">
                  {[
                    { name: "Help Center", href: "/help" },
                    { name: "Community", href: "/community" },
                    { name: "Contact Us", href: "/contact" },
                    { name: "System Status", href: "/status" },
                    { name: "Accessibility", href: "/accessibility" },
                  ].map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-purple-400 transition-colors flex items-center group"
                      >
                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-6">
                  Company
                </h3>
                <ul className="space-y-4">
                  {[
                    { name: "About Us", href: "/about" },
                    { name: "Careers", href: "/careers" },
                    { name: "Press Kit", href: "/press" },
                    { name: "Privacy Policy", href: "/privacy" },
                    { name: "Terms of Service", href: "/terms" },
                  ].map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-purple-400 transition-colors flex items-center group"
                      >
                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <span>© 2025 CourseXpert. All rights reserved.</span>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Made with love in India</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    99.9% Uptime
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    <Globe className="w-3 h-3 mr-1" />
                    Global
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default StudentHomePage;
