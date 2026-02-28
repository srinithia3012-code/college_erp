"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

type Faculty = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
};

export default function FacultyPage() {
  const router = useRouter();
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const data: Faculty[] = await apiFetch("/api/faculty");
        setFacultyList(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load faculty.");
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  if (loading) return <p className="text-gray-500">Loading faculty...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!facultyList || facultyList.length === 0)
    return <p className="text-gray-600">No faculty found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Faculty List</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2 text-left">Department</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {facultyList.map((f) => (
            <tr key={f.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">
                {f.first_name} {f.last_name}
              </td>
              <td className="border px-4 py-2">{f.email}</td>
              <td className="border px-4 py-2">{f.department}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => router.push(`/faculty/${f.id}`)}
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
