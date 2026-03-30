"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

type Student = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export default function StudentsPage() {
  const router = useRouter();

  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await apiFetch("/api/students");
        console.log(data)
        setStudentsList(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <p className="text-gray-500">Loading students...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (studentsList?.length === 0) return <p className="text-gray-600">No students found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Student List</h1>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {studentsList?.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{s.first_name} {s.last_name}</td>
              <td className="border px-4 py-2">{s.email}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => router.push(`/students/${s.id}`)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
