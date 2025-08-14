import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  TvMinimalPlay, 
  User, 
  Settings, 
  LogOut, 
  BookOpen, 
  MessageCircle,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Star,
  Trophy
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetCredentials, auth } = useContext(AuthContext);
  const user = auth?.user || {};
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Mock notification count
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }
  const isActive = (path) => location.pathname.includes(path);

  const navigationItems = [
    {
      label: "Explore Courses",
      path: "/courses",
      icon: BookOpen,
      description: "Browse available courses"
    },
    {
      label: "Live Chat",
      path: "/userschat",
      icon: MessageCircle,
      description: "Chat with instructors"
    }
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0f0c29]/95 backdrop-blur-md shadow-lg border-b border-gray-700' 
          : 'bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] border-b border-gray-800'
      }`}
    >
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Left Section: Logo + Navigation */}
        <div className="flex items-center space-x-2 lg:space-x-6">
          {/* Logo */}
          <Link 
            to="/home" 
            className="flex items-center group transition-transform hover:scale-105"
            aria-label="CourseXpert Home"
          >
            <div className="relative">
              <GraduationCap className="h-8 w-8 lg:h-10 lg:w-10 mr-2 text-cyan-200 group-hover:text-cyan-300 transition-colors" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-pulse"></div>
            </div>
            <span className="font-extrabold text-lg sm:text-xl lg:text-2xl xl:text-3xl bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text group-hover:from-indigo-300 group-hover:via-purple-300 group-hover:to-cyan-300 transition-all">
              CourseXpert
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={`relative group px-3 py-2 text-sm lg:text-base font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-cyan-400 bg-white/10'
                    : 'text-white hover:text-cyan-400 hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
                )}
              </Button>
            ))}
          </nav>
        </div>

        {/* Right Section: Actions + User Menu */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search Button - Desktop */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:flex items-center gap-2 text-white hover:text-cyan-400 hover:bg-white/5 transition-all"
            onClick={() => navigate('/search')}
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Search</span>
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative text-white hover:text-cyan-400 hover:bg-white/5 transition-all"
            onClick={() => navigate('/notifications')}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600"
              >
                {notifications}
              </Badge>
            )}
          </Button>

          {/* My Courses - Desktop */}
          <Button
            variant="ghost"
            onClick={() => navigate("/student-courses")}
            className={`hidden md:flex items-center gap-2 px-3 py-2 font-semibold text-sm lg:text-base transition-all duration-200 ${
              isActive('/student-courses')
                ? 'text-cyan-400 bg-white/10'
                : 'text-white hover:text-cyan-400 hover:bg-white/5'
            }`}
          >
            <TvMinimalPlay className="w-5 h-5" />
            <span>My Courses</span>
            {isActive('/student-courses') && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
            )}
          </Button>

          {/* User Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative p-1 rounded-full hover:bg-white/10 transition-all group"
                aria-label="User menu"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="cursor-pointer ring-2 ring-transparent group-hover:ring-cyan-400/50 transition-all">
                    <AvatarImage src={user.avatar || ""} alt={user.userName} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-violet-600 text-white font-semibold">
                      {user.userName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-4 h-4 text-white/70 group-hover:text-cyan-400 transition-colors hidden lg:block" />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
              className="w-64 mt-2 bg-[#1a1a1a]/95 backdrop-blur-md text-white border border-gray-700/50 shadow-2xl"
              align="end"
            >
              {/* User Info Header */}
              <DropdownMenuLabel className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar || ""} alt={user.userName} />
                    <AvatarFallback className="text-lg bg-gradient-to-br from-pink-500 to-violet-600 text-white">
                      {user.userName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">
                      {user.userName || 'User'}
                    </p>
                    <p className="text-sm text-gray-400 truncate">
                      {user.userEmail || 'user@example.com'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-400">Pro Student</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-gray-700/50" />

              {/* Menu Items */}
              <DropdownMenuItem 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors"
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>View Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => navigate('/student-courses')}
                className="md:hidden flex items-center gap-3 px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors"
              >
                <TvMinimalPlay className="w-4 h-4 text-green-400" />
                <span>My Courses</span>
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => navigate('/achievements')}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors"
              >
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Achievements</span>
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => navigate('/settings')}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-gray-700/50" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 cursor-pointer transition-colors text-red-400 hover:text-red-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-cyan-400 hover:bg-white/5 transition-all"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1a1a1a]/95 backdrop-blur-md border-t border-gray-700/50">
          <nav className="px-4 py-3 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full justify-start gap-3 px-4 py-3 text-left transition-all ${
                  isActive(item.path)
                    ? 'text-cyan-400 bg-white/10'
                    : 'text-white hover:text-cyan-400 hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
              </Button>
            ))}
            
            <Button
              variant="ghost"
              onClick={() => {
                navigate('/student-courses');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full justify-start gap-3 px-4 py-3 text-left transition-all ${
                isActive('/student-courses')
                  ? 'text-cyan-400 bg-white/10'
                  : 'text-white hover:text-cyan-400 hover:bg-white/5'
              }`}
            >
              <TvMinimalPlay className="w-4 h-4" />
              <div>
                <div className="font-medium">My Courses</div>
                <div className="text-xs text-gray-400">View enrolled courses</div>
              </div>
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                navigate('/search');
                setIsMobileMenuOpen(false);
              }}
              className="w-full justify-start gap-3 px-4 py-3 text-left text-white hover:text-cyan-400 hover:bg-white/5 transition-all"
            >
              <Search className="w-4 h-4" />
              <div>
                <div className="font-medium">Search</div>
                <div className="text-xs text-gray-400">Find courses and content</div>
              </div>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default StudentViewCommonHeader;