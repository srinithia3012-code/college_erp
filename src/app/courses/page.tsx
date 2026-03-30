"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/utils/api";
import type { Course } from "@/types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    apiFetch("/api/courses").then(setCourses);
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Courses</h2>
        <Link href="/courses/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Course
        </Link>
      </div>

      <table className="w-full bg-white border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Code</th>
            <th className="p-2">Description</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.code}</td>
              <td className="p-2">{c.description || "-"}</td>
              <td className="p-2">
                <Link href={`/courses/${c.id}`} className="text-blue-600">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
