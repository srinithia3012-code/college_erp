"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/utils/api";

type Attendance = {
  id: string;
  student_id: string;
  course_id: string;
  date: string;
  status: string;
};

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/attendance")
      .then(setAttendance)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Attendance</h2>

        <Link
          href="/attendance/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Mark Attendance
        </Link>
      </div>

      <table className="w-full bg-white border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Student</th>
            <th className="p-2">Course</th>
            <th className="p-2">Date</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {attendance.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="p-2">{a.student_id}</td>
              <td className="p-2">{a.course_id}</td>
              <td className="p-2">
                {new Date(a.date).toLocaleDateString()}
              </td>
              <td className="p-2">{a.status}</td>
              <td className="p-2">
                <Link
                  href={`/attendance/${a.id}`}
                  className="text-blue-600"
                >
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
