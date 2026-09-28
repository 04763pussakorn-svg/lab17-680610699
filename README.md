# lab17-2569-starter — Zod + React Hook Form

```bash
pnpm install
pnpm dev
```

---

## มีอะไรให้แล้ว

- หน้า **จัดการนักศึกษา** (`/admin/students`) — ฟอร์มเพิ่มนักศึกษาใช้ **Zod + React Hook Form** แล้ว
  ใช้เป็นตัวอย่างได้: `src/components/students/add-new-student-dialog.tsx`, `src/lib/schemas/student-schema.ts`
- หน้า **จัดการวิชาเรียน** (`/admin/courses`) — ฟอร์มเพิ่มวิชายัง Validate **แบบเขียนเอง** (useState + if-else)
  ใน `src/components/courses/add-new-course-dialog.tsx` + `src/lib/course-validation.ts`
- shadcn/ui components ที่ต้องใช้ติดตั้งไว้แล้ว: `field`, `select`, `radio-group`, `textarea`, `switch`
- `zod`, `react-hook-form`, `@hookform/resolvers` อยู่ใน `package.json` แล้ว

---

### อัพเดตไฟล์

`src/lib/mock-data.ts`

```ts
import type { Student, Course, Enrollment } from "@/lib/types";

export const students: Student[] = [
  {
    studentId: "650610001",
    firstName: "Matt",
    lastName: "Damon",
    program: "CPE",
    interests: ["web", "mobile"],
    emails: [{ address: "matt.damon@cmu.ac.th" }],
  },
  {
    studentId: "650610002",
    firstName: "Cillian",
    lastName: "Murphy",
    program: "CPE",
    courses: ["261207", "261497"],
    interests: ["ai"],
    emails: [
      { address: "cillian.murphy@cmu.ac.th" },
      { address: "cillian.m@gmail.com" },
    ],
  },
  {
    studentId: "650610003",
    firstName: "Emily",
    lastName: "Blunt",
    program: "ISNE",
    courses: ["269101", "261497"],
    interests: ["network", "web", "ai"],
    emails: [{ address: "emily.blunt@cmu.ac.th" }],
  },
];

export const courses: Course[] = [
  {
    courseId: "261207",
    courseTitle: "Basic Computer Engineering Lab",
    instructors: [
      { name: "Dome", email: "dome@cmu.ac.th" },
      { name: "Chanadda", email: "chanadda@cmu.ac.th" },
    ],
    program: "CPE",
    semester: "1",
    description: "ปฏิบัติการพื้นฐานวิศวกรรมคอมพิวเตอร์",
    notifyByEmail: true,
  },
  {
    courseId: "261497",
    courseTitle: "Full Stack Development",
    instructors: [
      { name: "Dome", email: "dome@cmu.ac.th" },
      { name: "Nirand", email: "nirand@cmu.ac.th" },
      { name: "Chanadda", email: "chanadda@cmu.ac.th" },
    ],
    program: "CPE",
    semester: "2",
    description: "",
    notifyByEmail: false,
  },
  {
    courseId: "269101",
    courseTitle: "Introduction to Information Systems and Network Engineering",
    instructors: [{ name: "KENNETH COSH", email: "kenneth.cosh@cmu.ac.th" }],
    program: "ISNE",
    semester: "1",
    description: "",
    notifyByEmail: false,
  },
];

export const enrollments: Enrollment[] = [
  { studentId: "650610002", courseId: "261207" },
  { studentId: "650610002", courseId: "261497" },
  { studentId: "650610003", courseId: "269101" },
  { studentId: "650610003", courseId: "261497" },
];

/**
 * นักศึกษาที่ "ล็อกอินอยู่" ในหน้านี้ — โปรเจกต์นี้ตัดระบบ Login/Role (ADMIN vs STUDENT)
 * ออกไปทั้งหมดตามที่ต้องการ จึงกำหนดผู้ใช้ปัจจุบันไว้ตรงนี้ที่เดียว
 * เปลี่ยนค่านี้เพื่อดูมุมมองของนักศึกษาคนอื่นได้
 */
export const CURRENT_STUDENT_ID = "650610002";
export const currentStudent = students.find(
  (s) => s.studentId === CURRENT_STUDENT_ID,
)!;
```

`src/lib/type.ts`

```ts
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

interface Instructor {
  name: string;
  email: string;
}
export type { Instructor };

interface Course {
  courseId: string;
  courseTitle: string;
  instructors: Instructor[];
  program?: "CPE" | "ISNE";
  semester?: "1" | "2" | "3";
  description?: string;
  notifyByEmail?: boolean;
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
```
