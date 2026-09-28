import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import { ThemeProvider } from "@/components/theme-provider";
import RootLayout from "@/layouts/root-layout";
import HomePage from "@/pages/home";
import AdminStudentsPage from "@/pages/admin/students";
import AdminCoursesPage from "@/pages/admin/courses";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "admin/students", element: <AdminStudentsPage /> },
      { path: "admin/courses", element: <AdminCoursesPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
