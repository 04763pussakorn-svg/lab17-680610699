import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  students as initialStudents,
  courses as initialCourses,
  enrollments as initialEnrollments,
} from "@/lib/mock-data";
import type { Course, Enrollment, Student } from "@/lib/types";

type EnrollmentStore = {
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];

  addStudent: (student: Student) => void;
  removeStudent: (studentId: string) => void;
  addCourse: (course: Course) => void;
  removeCourse: (courseId: string) => void;
};

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set) => ({
      students: initialStudents,
      courses: initialCourses,
      enrollments: initialEnrollments,

      addStudent: (student) =>
        set((state) => ({ students: [...state.students, student] })),

      removeStudent: (studentId) =>
        set((state) => ({
          students: state.students.filter((s) => s.studentId !== studentId),
          enrollments: state.enrollments.filter(
            (e) => e.studentId !== studentId,
          ),
        })),

      addCourse: (course) =>
        set((state) => ({ courses: [...state.courses, course] })),

      removeCourse: (courseId) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.courseId !== courseId),
          enrollments: state.enrollments.filter((e) => e.courseId !== courseId),
        })),
    }),
    {
      name: "lab17-2569-680610699",
      // เก็บเฉพาะ students/courses ลง localStorage — enrollments ไม่ persist
      partialize: (state) => ({
        students: state.students,
        courses: state.courses,
      }),
    },
  ),
);
