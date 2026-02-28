"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/utils/api";

type Result = {
  id: number;
  student_id: number;
  course_id: number;
  marks: number;
  grade: string;
};

export default function ResultPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/results")
      .then(setResults)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Results</h2>
        <Link
          href="/result/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Result
        </Link>
      </div>

      <table className="w-full bg-white border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Student ID</th>
            <th className="p-2">Course ID</th>
            <th className="p-2">Marks</th>
            <th className="p-2">Grade</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {results.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.student_id}</td>
              <td className="p-2">{r.course_id}</td>
              <td className="p-2">{r.marks}</td>
              <td className="p-2">{r.grade}</td>
              <td className="p-2">
                <Link
                  href={`/result/${r.id}`}
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
