import { z } from "zod";

import type { Student } from "@/lib/types";

export const MAX_INTERESTS = 3;
export const MAX_EMAILS = 3;

// ใช้ร่วมกันระหว่างฟอร์ม (Checkbox) กับตารางจัดการนักศึกษา (แสดง label)
export const interestOptions = [
  { id: "web", label: "Web Development" },
  { id: "mobile", label: "Mobile Application" },
  { id: "ai", label: "AI / Machine Learning" },
  { id: "network", label: "Network & Security" },
];

export const studentFormSchema = z.object({
  studentId: z
    .string()
    .trim()
    .regex(/^\d{9}$/, "รหัสนักศึกษาต้องเป็นตัวเลข 9 หลัก"),
  firstName: z.string().trim().min(1, "กรอกชื่อ"),
  lastName: z.string().trim().min(1, "กรอกนามสกุล"),
  program: z.enum(["CPE", "ISNE"], { message: "เลือกหลักสูตร" }),
  // Checkbox หลายตัว → array ของ id
  interests: z
    .array(z.string())
    .min(1, "เลือกความสนใจอย่างน้อย 1 ด้าน")
    .max(MAX_INTERESTS, `เลือกได้ไม่เกิน ${MAX_INTERESTS} ด้าน`),
  // Array Fields (useFieldArray) — array ของ object เพื่อให้แต่ละแถวมี field.id เป็น key
  emails: z
    .array(
      z.object({
        address: z.email("อีเมลไม่ถูกต้อง"), // ← ตรวจทีละแถว
      }),
    )
    // ─── Array Validation: ตรวจทั้งรายการ ───
    .min(1, "ต้องมีอีเมลอย่างน้อย 1 อีเมล")
    .max(MAX_EMAILS, `มีอีเมลได้ไม่เกิน ${MAX_EMAILS} อีเมล`)
    .refine(
      (items) =>
        new Set(items.map((i) => i.address.toLowerCase())).size ===
        items.length,
      "อีเมลซ้ำกัน",
    ),
});

// ได้ type จาก schema ตรงๆ — ไม่ต้องประกาศ StudentFormValues ซ้ำเอง
export type StudentFormValues = z.infer<typeof studentFormSchema>;

/**
 * กันรหัสซ้ำด้วย .refine()
 * ต้องสร้าง "ข้างใน" component (ผ่าน useMemo) เพราะต้องรู้ students ล่าสุดจาก store
 */
export function createStudentFormSchema(existingStudents: Student[]) {
  return studentFormSchema.refine(
    (data) => !existingStudents.some((s) => s.studentId === data.studentId),
    { message: "รหัสนักศึกษานี้มีอยู่แล้ว", path: ["studentId"] },
  );
}
