import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteButton } from "@/components/confirm-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { semesterOptions } from "@/lib/schemas/course-schema";
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
            <TableHead>หลักสูตร</TableHead>
            <TableHead>ภาคการศึกษา</TableHead>
            <TableHead>รายละเอียด</TableHead>
            <TableHead>ผู้สอน</TableHead>
            <TableHead>รับข่าวสารทางอีเมล</TableHead>
            <TableHead className="w-20">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
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
                {course.program ? (
                  <Badge variant="secondary">{course.program}</Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {semesterOptions.find((o) => o.value === course.semester)
                  ?.label ?? <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="max-w-48">
                {course.description || (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {course.instructors.length === 0 ? (
                  <span className="text-muted-foreground">ยังไม่มีผู้สอน</span>
                ) : (
                  <div className="flex flex-col gap-1">
                    {course.instructors.map((instructor) => (
                      <div key={instructor.email} className="leading-tight">
                        <div>{instructor.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {instructor.email}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={course.notifyByEmail ? "default" : "outline"}>
                  {course.notifyByEmail ? "รับ" : "ไม่รับ"}
                </Badge>
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
