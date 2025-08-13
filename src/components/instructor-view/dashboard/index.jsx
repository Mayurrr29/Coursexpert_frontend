import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, IndianRupeeIcon, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function InstructorDashboard({ listOfCourses }) {
  function calculateTotalStudentsAndProfit() {
    const { totalStudents, totalProfit, studentList } = listOfCourses.reduce(
      (acc, course) => {
        const studentCount = course.students.length;
        acc.totalStudents += studentCount;
        acc.totalProfit += course.pricing * studentCount;

        course.students.forEach((student) => {
          acc.studentList.push({
            courseTitle: course.title,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
          });
        });

        return acc;
      },
      {
        totalStudents: 0,
        totalProfit: 0,
        studentList: [],
      }
    );

    return {
      totalProfit,
      totalStudents,
      studentList,
    };
  }

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: calculateTotalStudentsAndProfit().totalStudents,
      color: "text-indigo-700",
      bgColor: "bg-indigo-100",
    },
    {
      icon:IndianRupeeIcon,
      label: "Total Revenue",
      value: `₹ ${calculateTotalStudentsAndProfit().totalProfit}`,
      color: "text-orange-700",
      bgColor: "bg-orange-100",
    },
  ];

  // Data for the Area Chart
  const areaChartData = [
    {
      name: "Month 1",
      students: calculateTotalStudentsAndProfit().totalStudents * 0.6,
      revenue: calculateTotalStudentsAndProfit().totalProfit * 0.6,
    },
    {
      name: "Month 2",
      students: calculateTotalStudentsAndProfit().totalStudents * 0.8,
      revenue: calculateTotalStudentsAndProfit().totalProfit * 0.8,
    },
    {
      name: "Month 3",
      students: calculateTotalStudentsAndProfit().totalStudents,
      revenue: calculateTotalStudentsAndProfit().totalProfit,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Cards for Total Students & Total Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {config.map((item, index) => (
          <Card 
            key={index} 
            className={`${item.bgColor} shadow-lg hover:shadow-2xl transition duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className={`text-md font-bold ${item.color}`}>
                {item.label}
              </CardTitle>
              <item.icon className={`h-8 w-8 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-extrabold ${item.color}`}>{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Area Chart for Total Students and Total Revenue */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Growth Analytics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={areaChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="students"
              stroke="#00BFFF"
              fill="#00BFFF"
              fillOpacity={0.4}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#FF6347"
              fill="#FF6347"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Students List */}
      <Card className="shadow-lg hover:shadow-2xl transition duration-300">
        <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-md">
          <CardTitle className="text-lg font-extrabold tracking-wide">Students List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-indigo-700 font-bold uppercase">Course Name</TableHead>
                  <TableHead className="text-purple-700 font-bold uppercase">Student Name</TableHead>
                  <TableHead className="text-pink-700 font-bold uppercase">Student Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculateTotalStudentsAndProfit().studentList.map(
                  (studentItem, index) => (
                    <TableRow
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <TableCell className="font-semibold text-gray-900">
                        {studentItem.courseTitle}
                      </TableCell>
                      <TableCell className="text-gray-700">{studentItem.studentName}</TableCell>
                      <TableCell className="text-gray-700">{studentItem.studentEmail}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorDashboard;
