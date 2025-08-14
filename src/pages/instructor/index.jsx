import AdminCommentPanel from "@/components/AdminCommentPanel";
import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BarChart, Book, LogOut,MessageSquare } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import StudentList from "../chatpages/StudentList";
import InstructorSide from "../chatpages/InstructorSide";

function InstructorDashboardpage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { resetCredentials } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } = useContext(InstructorContext);

  async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService();
    if (response?.success) setInstructorCoursesList(response?.data);
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorSide></InstructorSide>,
    },
    {
      icon: MessageSquare,
      label: "LiveMessages",
      value: "LiveMessages",
      component:<StudentList></StudentList>// Placeholder for future comments feature
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
    {
      icon: MessageSquare,
      label: "Comments",
      value: "comments",
      component:<AdminCommentPanel></AdminCommentPanel>// Placeholder for future comments feature
    }
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <div className="flex h-full min-h-screen bg-gradient-to-r from-[#e0f7fa] to-[#e0eafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#28788C] text-white hidden md:flex flex-col shadow-xl">
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Instructor Panel</h2>
          <nav className="flex flex-col space-y-4">
            {menuItems.map((menuItem) => (
              <Button
                key={menuItem.value}
                variant="ghost"
                onClick={
                  menuItem.value === "logout" ? handleLogout : () => setActiveTab(menuItem.value)
                }
                className={`w-full justify-start py-3 px-4 rounded-lg text-lg font-semibold ${
                  activeTab === menuItem.value
                    ? "bg-white text-[#28788C]"
                    : "hover:bg-[#21616f] hover:text-white"
                } transition duration-300`}
              >
                <menuItem.icon className="mr-3 h-5 w-5" />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-8 text-[#28788C]">Dashboard</h1>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {menuItems.map((menuItem) => (
                <TabsContent
                  key={menuItem.value}
                  value={menuItem.value}
                  className="animate-fadeIn"
                >
                  {menuItem.component !== null ? menuItem.component : null}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
