import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>ระบบลงทะเบียนเรียน CPE & ISNE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Lecture 17: รับข้อมูลและตรวจสอบก่อนเข้าสู่ระบบ
          </p>
          <div className="flex flex-wrap gap-2">
            <Button render={<Link to="/admin/students" />}>
              ไปหน้าจัดการนักศึกษา
            </Button>
            <Button variant="outline" render={<Link to="/admin/courses" />}>
              ไปหน้าจัดการวิชาเรียน
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
