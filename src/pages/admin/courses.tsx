import { AddNewCourseDialog } from "@/components/courses/add-new-course-dialog";
import { CourseTable } from "@/components/courses/course-table";
import { useEnrollmentStore } from "@/lib/enrollment-store";

export default function AdminCoursesPage() {
  const courseCount = useEnrollmentStore((s) => s.courses.length);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">จัดการวิชาเรียน</h1>
          <p className="text-sm text-muted-foreground">
            {courseCount} วิชา — เพิ่มวิชาใหม่ได้ที่นี่
          </p>
        </div>
        <AddNewCourseDialog />
      </div>

      <CourseTable />
    </div>
  );
}
