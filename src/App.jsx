import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
import RouteGuard from "./components/route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import InstructorDashboardpage from "./pages/instructor";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";
import NotFoundPage from "./pages/not-found";
import AddNewCoursePage from "./pages/instructor/add-new-course";
import StudentViewCoursesPage from "./pages/student/courses";
import StudentViewCourseDetailsPage from "./pages/student/course-details";
import PaypalPaymentReturnPage from "./pages/student/payment-return";
import StudentCoursesPage from "./pages/student/student-courses";
import StudentViewCourseProgressPage from "./pages/student/course-progress";
import InstructorsList from "./pages/chatpages/InstructorsList";
import ChatPage from "./pages/chatpages/ChatPage";
import InstructorChatList from "./pages/chatpages/InstructorChatList";
import StudentList from "./pages/chatpages/StudentList";
import InstructorChatPage from "./pages/chatpages/InstructorChatPage";
import UserSide from "./pages/chatpages/UserSide";
import InstructorSide from "./pages/chatpages/InstructorSide";
function App() {
  const { auth } = useContext(AuthContext);

  return (
     <div className="min-h-screen overflow-x-hidden">
       <Routes>
      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorDashboardpage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
 
      <Route
        path="/instructor/create-new-course"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/edit-course/:courseId"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/"
        element={
          <RouteGuard
            element={<StudentViewCommonLayout />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      >


        <Route path="" element={<StudentHomePage />} />
        <Route path="home" element={<StudentHomePage />} />
        <Route path="courses" element={<StudentViewCoursesPage />} />
        <Route path="course/details/:id" element={<StudentViewCourseDetailsPage />} />
        <Route path="payment-return" element={<PaypalPaymentReturnPage />} />
        <Route path="student-courses" element={<StudentCoursesPage />} />
        <Route path="course-progress/:id" element={<StudentViewCourseProgressPage />} />
        {/* <Route path="instructlist" element={<InstructorsList />}/> 
        <Route path="chat/:instructorId" element={<ChatPage />} />        //chat with instructor USERSSIDE */}
        <Route path="userschat" element={<UserSide />} />   // chat with instructors FOR USERS

        <Route path="instructor/chat" 
        element={
          <RouteGuard
             element={<InstructorSide />} 
             authenticated={auth?.authenticate}
              user={auth?.user}
          />
        }
        /> 
        {/* <Route path="instructor/chat" 
        element={
          <RouteGuard
             element={<InstructorChatList />} 
             authenticated={auth?.authenticate}
              user={auth?.user}
          />
        }
        /> // chat with students
        <Route path="/instructor/chat/:studentId" 
         element={
          <RouteGuard
          element={<InstructorChatPage />}
           authenticated={auth?.authenticate}
              user={auth?.user}
          />
         } 
        />  // chat with student */}
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </div>
  
  );
}

export default App;
