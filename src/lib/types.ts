interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  program: "CPE" | "ISNE";
  courses?: string[];
  interests?: string[];
  emails?: StudentEmail[];
}
export type { Student };

interface StudentEmail {
  address: string;
}
export type { StudentEmail };

interface Course {
  courseId: string;
  courseTitle: string;
  instructors: string[];
}
export type { Course };

interface Enrollment {
  studentId: string;
  courseId: string;
  enrolledAt?: string;
}
export type { Enrollment };

// ผู้ใช้ระบบ (สำหรับ Login) — โปรเจกต์นี้ตัดระบบ Login ออกทั้งหมด (ดู
// mock-data.ts: CURRENT_STUDENT_ID) type นี้เลยไม่ได้ใช้งานจริงในแอป ADMIN นี้
// เก็บไว้เผื่ออ้างอิงตอนต่อ Backend จริง
interface User {
  username: string;
  password: string;
  studentId?: string | null;
  role: "STUDENT" | "ADMIN";
  tokens?: string[];
}
export type { User };
