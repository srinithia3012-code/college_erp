"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

export default function NewFeePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    student_id: "",
    amount: "",
    status: "pending",
  });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await apiFetch("/api/fees", {
      method: "POST",
      body: JSON.stringify({
        student_id: form.student_id,
        amount: Number(form.amount),
        status: form.status,
      }),
    });

    router.push("/fees");
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-xl bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-semibold">Add Fee</h2>

      <input
        placeholder="Student ID"
        className="w-full border p-2 rounded"
        value={form.student_id}
        onChange={(e) =>
          setForm({ ...form, student_id: e.target.value })
        }
        required
      />

      <input
        type="number"
        placeholder="Amount"
        className="w-full border p-2 rounded"
        value={form.amount}
        onChange={(e) =>
          setForm({ ...form, amount: e.target.value })
        }
        required
      />

      <select
        className="w-full border p-2 rounded"
        value={form.status}
        onChange={(e) =>
          setForm({ ...form, status: e.target.value })
        }
      >
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Create Fee
      </button>
    </form>
  );
}
