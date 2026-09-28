import { ConfirmDeleteButton } from "@/components/confirm-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";

export function CourseTable() {
  const courses = useEnrollmentStore((s) => s.courses);
  const removeCourse = useEnrollmentStore((s) => s.removeCourse);

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>รหัสวิชา</TableHead>
            <TableHead>ชื่อวิชา</TableHead>
            <TableHead>ผู้สอน</TableHead>
            <TableHead className="w-20">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-20 text-center text-muted-foreground"
              >
                ยังไม่มีวิชาที่เปิดสอน
              </TableCell>
            </TableRow>
          )}
          {courses.map((course) => (
            <TableRow key={course.courseId}>
              <TableCell>{course.courseId}</TableCell>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell>
                {/* แสดงรายชื่อผู้สอนเป็นข้อความธรรมดา คั่นด้วย ", " */}
                {course.instructors.length === 0 ? (
                  <span className="text-muted-foreground">ยังไม่มีผู้สอน</span>
                ) : (
                  course.instructors.join(", ")
                )}
              </TableCell>
              <TableCell>
                <ConfirmDeleteButton
                  label={`ลบวิชา ${course.courseId}`}
                  title="ลบวิชา?"
                  description={`ลบ ${course.courseId} — ${course.courseTitle} ออกจากรายวิชาที่เปิดสอน พร้อมการลงทะเบียนทั้งหมดของวิชานี้`}
                  onConfirm={() => removeCourse(course.courseId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
