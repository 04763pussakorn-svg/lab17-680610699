import { FlaskConical } from "lucide-react";

import { ConfirmDeleteButton } from "@/components/confirm-button";
import { AddNewStudentDialog } from "@/components/students/add-new-student-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { interestOptions } from "@/lib/schemas/student-schema";

const interestLabel = (id: string) =>
  interestOptions.find((o) => o.id === id)?.label ?? id;

/**
 * จัดการนักศึกษา
 * ฟอร์มเพิ่มนักศึกษา + ความสนใจ + อีเมล อยู่ในปุ่ม popup (AddNewStudentDialog)
 * Validate ด้วย React Hook Form + Zod — ดู lib/schemas/student-schema.ts
 */
export default function AdminStudentsPage() {
  const { students, enrollments, addStudent, removeStudent } =
    useEnrollmentStore();

  const handleAddWithoutValidate = () => {
    addStudent({
      studentId: "65061",
      firstName: "Garbage",
      lastName: "",
      program: "CPE",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">จัดการนักศึกษา</h1>
          <p className="text-sm text-muted-foreground">
            {students.length} คน — Lecture 17:
            รับข้อมูลและตรวจสอบก่อนเข้าสู่ระบบ
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleAddWithoutValidate}>
            <FlaskConical className="h-4 w-4" />
            จำลองข้อมูลจากฟอร์ม (ไม่ Validate)
          </Button>
          <AddNewStudentDialog />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสนักศึกษา</TableHead>
              <TableHead>ชื่อ</TableHead>
              <TableHead>นามสกุล</TableHead>
              <TableHead>หลักสูตร</TableHead>
              <TableHead>ความสนใจ</TableHead>
              <TableHead>อีเมล</TableHead>
              <TableHead>วิชาที่ลงทะเบียน</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((s, i) => (
              <TableRow key={`${s.studentId}-${i}`}>
                <TableCell>{s.studentId}</TableCell>
                <TableCell>{s.firstName}</TableCell>
                <TableCell>
                  {s.lastName || <Badge variant="destructive">ว่างเปล่า</Badge>}
                </TableCell>
                <TableCell>{s.program}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {s.interests?.length ? (
                      s.interests.map((id) => (
                        <Badge key={id} variant="outline">
                          {interestLabel(id)}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {s.emails?.length ? (
                    <div className="flex flex-col gap-0.5 text-sm">
                      {s.emails.map((e) => (
                        <span key={e.address}>{e.address}</span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {enrollments
                      .filter((e) => e.studentId === s.studentId)
                      .map((e) => (
                        <Badge key={e.courseId} variant="secondary">
                          {e.courseId}
                        </Badge>
                      ))}
                  </div>
                </TableCell>
                <TableCell>
                  <ConfirmDeleteButton
                    label={`ลบ ${s.studentId}`}
                    title="ลบนักศึกษา?"
                    description={`ลบ ${s.studentId} ${s.firstName} ${s.lastName} พร้อมการลงทะเบียนทั้งหมด`}
                    onConfirm={() => removeStudent(s.studentId)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
