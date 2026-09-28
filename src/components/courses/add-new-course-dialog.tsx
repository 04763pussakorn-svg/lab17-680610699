import { Fragment, useState } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  emptyCourseForm,
  validateCourseField,
  validateCourseForm,
  type CourseFormErrors,
  type CourseFormValues,
} from "@/lib/course-validation";
import { useEnrollmentStore } from "@/lib/enrollment-store";
/**
 *   (Lab 17): เขียนฟอร์มนี้ใหม่ด้วย Zod + React Hook Form
 *   (ดูตัวอย่างใน components/students/add-new-student-dialog.tsx)
 *   - schema ใหม่ที่ src/lib/schemas/course-schema.ts (แทน course-validation.ts)
 *   - ผู้สอนเป็น Array Fields (useFieldArray) — ชื่อ + อีเมล @cmu.ac.th, 1–3 คน
 *   - หลักสูตร (Select), ภาคการศึกษา (Radio Group), รายละเอียด (Textarea 0/100),
 *     รับข่าวสารทางอีเมล (Switch)
 */
export function AddNewCourseDialog() {
  const addCourse = useEnrollmentStore((s) => s.addCourse);
  const courses = useEnrollmentStore((s) => s.courses);
  const [open, setOpen] = useState(false);

  // state ที่ต้องถือเองสามก้อน (Zod + React Hook Form จะรวมเป็น useForm ตัวเดียว)
  const [values, setValues] = useState<CourseFormValues>(emptyCourseForm);
  const [errors, setErrors] = useState<CourseFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof CourseFormValues, boolean>>
  >({});

  const [instructorInput, setInstructorInput] = useState("");
  const instructorsAnchor = useComboboxAnchor();

  const knownInstructors = [...new Set(courses.flatMap((c) => c.instructors))];
  const typedInstructor = instructorInput.trim();
  const isNewInstructor =
    typedInstructor.length > 0 &&
    !knownInstructors.some(
      (name) => name.toLowerCase() === typedInstructor.toLowerCase(),
    ) &&
    !values.instructors.includes(typedInstructor);
  const instructorItems = [
    ...knownInstructors,
    ...values.instructors.filter((name) => !knownInstructors.includes(name)),
    ...(isNewInstructor ? [typedInstructor] : []),
  ];

  const checkField = (name: keyof CourseFormValues, next: CourseFormValues) => {
    setErrors((prev) => ({
      ...prev,
      [name]: validateCourseField(name, next, courses),
    }));
  };

  const handleChange = <K extends keyof CourseFormValues>(
    name: K,
    value: CourseFormValues[K],
  ) => {
    const next = { ...values, [name]: value };
    setValues(next);
    // ช่องที่เคยออกไปแล้ว (touched) เช็กใหม่ทันทีตอนแก้ — error หายเมื่อแก้ถูก
    if (touched[name]) checkField(name, next);
  };

  // เทียบได้กับ mode: "onBlur" ของ React Hook Form
  const handleBlur = (name: keyof CourseFormValues) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    checkField(name, values);
  };

  const resetForm = () => {
    setValues(emptyCourseForm);
    setErrors({});
    setTouched({});
    setInstructorInput("");
  };

  // ด่านตรวจก่อนเข้า store — เทียบได้กับ form.handleSubmit(onSubmit)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validateCourseForm(values, courses);
    setErrors(nextErrors);
    setTouched({ courseId: true, courseTitle: true, instructors: true });
    if (Object.keys(nextErrors).length > 0) return; // ไม่ผ่าน → ไม่เรียก addCourse

    addCourse({
      courseId: values.courseId.trim(),
      courseTitle: values.courseTitle.trim(),
      instructors: values.instructors,
    });
    resetForm();
    setOpen(false);
  };

  // ต้องต่อ id / aria-* / ข้อความ error เองทุกช่อง (<FormItem/FormControl/FormMessage> จะทำแทน)
  const errorOf = (name: keyof CourseFormValues) =>
    touched[name] ? errors[name] : undefined;

  const invalidProps = (name: keyof CourseFormValues) => ({
    "aria-invalid": errorOf(name) ? true : undefined,
    "aria-describedby": errorOf(name) ? `${name}-error` : undefined,
  });

  const fieldError = (name: keyof CourseFormValues) => {
    const message = errorOf(name);
    return message ? (
      <p id={`${name}-error`} className="text-sm text-destructive">
        {message}
      </p>
    ) : null;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger render={<Button />}>
        <PlusCircle className="h-4 w-4" />
        เพิ่มวิชา
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
            <DialogDescription>
              กรอกรหัสวิชา ชื่อวิชา และผู้สอน
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-1.5">
            <Label htmlFor="courseId">รหัสวิชา</Label>
            <Input
              id="courseId"
              placeholder="เช่น 261305"
              inputMode="numeric"
              value={values.courseId}
              onChange={(e) => handleChange("courseId", e.target.value)}
              onBlur={() => handleBlur("courseId")}
              {...invalidProps("courseId")}
            />
            {fieldError("courseId")}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="courseTitle">ชื่อวิชา</Label>
            <Input
              id="courseTitle"
              placeholder="เช่น Mobile Application Development"
              value={values.courseTitle}
              onChange={(e) => handleChange("courseTitle", e.target.value)}
              onBlur={() => handleBlur("courseTitle")}
              {...invalidProps("courseTitle")}
            />
            {fieldError("courseTitle")}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="instructors">ผู้สอน</Label>
            <Combobox
              multiple
              autoHighlight
              items={instructorItems}
              value={values.instructors}
              onValueChange={(v) => {
                handleChange("instructors", v as string[]);
                setInstructorInput("");
              }}
              inputValue={instructorInput}
              onInputValueChange={setInstructorInput}
            >
              <ComboboxChips ref={instructorsAnchor} className="w-full">
                <ComboboxValue>
                  {(selected: string[]) => (
                    <Fragment>
                      {selected.map((name) => (
                        <ComboboxChip key={name}>{name}</ComboboxChip>
                      ))}
                      <ComboboxChipsInput
                        id="instructors"
                        placeholder={
                          selected.length === 0
                            ? "เลือกหรือพิมพ์ชื่อผู้สอน (ได้หลายคน)"
                            : ""
                        }
                        onBlur={() => handleBlur("instructors")}
                        {...invalidProps("instructors")}
                      />
                    </Fragment>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={instructorsAnchor}>
                <ComboboxEmpty>พิมพ์ชื่อเพื่อเพิ่มผู้สอนใหม่</ComboboxEmpty>
                <ComboboxList>
                  {(name: string) => (
                    <ComboboxItem key={name} value={name}>
                      {name === typedInstructor && isNewInstructor
                        ? `+ เพิ่มผู้สอน "${name}"`
                        : name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            {fieldError("instructors")}
          </div>

          <DialogFooter>
            <Button type="submit">บันทึก</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
