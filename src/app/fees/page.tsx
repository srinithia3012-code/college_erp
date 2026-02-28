"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/utils/api";

type Fee = {
  id: string;
  student_id: string;
  amount: number;
  status: string;
};

export default function FeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/fees")
      .then(setFees)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Fees</h2>

        <Link
          href="/fees/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Fee
        </Link>
      </div>

      <table className="w-full bg-white border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Student ID</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {fees.map((f) => (
            <tr key={f.id} className="border-t">
              <td className="p-2">{f.student_id}</td>
              <td className="p-2">₹ {f.amount}</td>
              <td className="p-2">{f.status}</td>
              <td className="p-2">
                <Link
                  href={`/fees/${f.id}`}
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
