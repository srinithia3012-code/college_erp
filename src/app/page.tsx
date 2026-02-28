"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

type DashboardStats = {
  students: number;
  faculty: number;
  courses: number;
  attendance: number;
  results: number;
  fees: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    students: 0,
    faculty: 0,
    courses: 0,
    attendance: 0,
    results: 0,
    fees: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch("/api/students"),
      apiFetch("/api/faculty"),
      apiFetch("/api/courses"),
      apiFetch("/api/attendance"),
      apiFetch("/api/results"),
      apiFetch("/api/fees"),
    ])
      .then(([students, faculty, courses, attendance, results, fees]) => {
        setStats({
          students: students.length,
          faculty: faculty.length,
          courses: courses.length,
          attendance: attendance.length,
          results: results.length,
          fees: fees.length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">College ERP Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Total Students" value={stats.students} />
        <DashboardCard title="Total Faculty" value={stats.faculty} />
        <DashboardCard title="Total Courses" value={stats.courses} />
        <DashboardCard title="Attendance Records" value={stats.attendance} />
        <DashboardCard title="Result Records" value={stats.results} />
        <DashboardCard title="Fee Records" value={stats.fees} />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white shadow rounded p-6">
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
