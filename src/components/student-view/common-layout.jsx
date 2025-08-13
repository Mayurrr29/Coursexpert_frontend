import { Outlet, useLocation } from "react-router-dom";
import StudentViewCommonHeader from "./header";

function StudentViewCommonLayout() {
  const location = useLocation();

  // Hide header if path includes "course-progress" or matches "/instructor/chat/:studentId"
  const hideHeader =
    location.pathname.includes("course-progress") ||
    /^\/instructor\/chat\/[^/]+$/.test(location.pathname);

  return (
    <div>
      {!hideHeader && <StudentViewCommonHeader />}
      <Outlet />
    </div>
  );
}

export default StudentViewCommonLayout;
