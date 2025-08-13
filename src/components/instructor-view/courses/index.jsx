import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);

  return (
    <Card className="shadow-lg hover:shadow-2xl transition duration-300">
      <CardHeader className="flex justify-between flex-row items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-md p-6">
        <CardTitle className="text-3xl font-extrabold tracking-wide">All Courses</CardTitle>
        <Button
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate("/instructor/create-new-course");
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition duration-300"
        >
          + Create New Course
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-indigo-700 font-bold uppercase">Course</TableHead>
                <TableHead className="text-purple-700 font-bold uppercase">Students</TableHead>
                <TableHead className="text-pink-700 font-bold uppercase">Revenue</TableHead>
                <TableHead className="text-right text-orange-700 font-bold uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listOfCourses && listOfCourses.length > 0
                ? listOfCourses.map((course, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-100 transition duration-200"
                    >
                      <TableCell className="font-semibold text-gray-900">
                        {course?.title}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {course?.students?.length}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        ₹{course?.students?.length * course?.pricing}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          onClick={() => {
                            navigate(`/instructor/edit-course/${course?._id}`);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                        >
                          <Delete className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : (
                  <TableRow>
                    <TableCell colSpan="4" className="text-center py-6 text-gray-500">
                      No Courses Available
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;
