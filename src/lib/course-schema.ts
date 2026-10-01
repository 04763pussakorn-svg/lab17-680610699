import { z } from "zod";

import type { Course } from "@/lib/types";

export const MAX_INSTRUCTORS = 3;
export const COURSE_TITLE_MAX = 100;
export const DESCRIPTION_MAX = 100;

export const semesterOptions = [
  { value: "1", label: "ภาคการศึกษาที่ 1" },
  { value: "2", label: "ภาคการศึกษาที่ 2" },
  { value: "3", label: "ภาคฤดูร้อน" },
];

export const programOptions = [
  { value: "CPE", label: "CPE — วิศวกรรมคอมพิวเตอร์" },
  { value: "ISNE", label: "ISNE — วิศวกรรมระบบสารสนเทศและเครือข่าย" },
];

export const courseFormSchema = z.object({
  courseId: z.string().trim().regex(/^\d{6}$/, "รหัสวิชาต้องเป็นตัวเลข 6 หลัก"),
  courseTitle: z
    .string()
    .trim()
    .min(1, "กรอกชื่อวิชา")
    .max(COURSE_TITLE_MAX, `ชื่อวิชายาวได้ไม่เกิน ${COURSE_TITLE_MAX} ตัวอักษร`),
  program: z.enum(["CPE", "ISNE"], { message: "เลือกหลักสูตร" }),
  semester: z.enum(["1", "2", "3"], { message: "เลือกภาคการศึกษา" }),
  description: z
    .string()
    .max(DESCRIPTION_MAX, `รายละเอียดยาวได้ไม่เกิน ${DESCRIPTION_MAX} ตัวอักษร`)
    .optional(),
  // Array Fields (useFieldArray) — array ของ object เพื่อให้แต่ละแถวมี field.id เป็น key
  instructors: z
    .array(
      z.object({
        name: z.string().trim().min(1, "กรอกชื่อผู้สอน"),
        email: z
          .email("อีเมลไม่ถูกต้อง")
          .refine((v) => v.endsWith("@cmu.ac.th"), "ต้องเป็นอีเมล @cmu.ac.th"),
      }),
    )
    // ─── Array Validation: ตรวจทั้งรายการ ───
    .min(1, "ต้องมีผู้สอนอย่างน้อย 1 คน")
    .max(MAX_INSTRUCTORS, `มีผู้สอนได้ไม่เกิน ${MAX_INSTRUCTORS} คน`)
    .refine(
      (items) =>
        new Set(items.map((i) => i.email.toLowerCase())).size === items.length,
      "อีเมลผู้สอนซ้ำกัน",
    ),
  notifyByEmail: z.boolean(),
});

// ได้ type จาก schema ตรงๆ — ไม่ต้องประกาศ CourseFormValues ซ้ำเอง
export type CourseFormValues = z.infer<typeof courseFormSchema>;

/**
 * กันรหัสวิชาซ้ำด้วย .refine()
 * ต้องสร้าง "ข้างใน" component (ผ่าน useMemo) เพราะต้องรู้ courses ล่าสุดจาก store
 */
export function createCourseFormSchema(existingCourses: Course[]) {
  return courseFormSchema.refine(
    (data) => !existingCourses.some((c) => c.courseId === data.courseId),
    { message: "รหัสวิชานี้มีอยู่แล้ว", path: ["courseId"] },
  );
}
