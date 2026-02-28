"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

export default function EditFeePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState({
    student_id: "",
    amount: "",
    status: "",
  });

  useEffect(() => {
    if (!id) return;

    apiFetch(`/api/fees/${id}`).then((data) =>
      setForm({
        student_id: data.student_id,
        amount: data.amount.toString(),
        status: data.status,
      })
    );
  }, [id]);

  const update = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await apiFetch(`/api/fees/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        student_id: form.student_id,
        amount: Number(form.amount),
        status: form.status,
      }),
    });

    router.push("/fees");
  };

  const remove = async () => {
    await apiFetch(`/api/fees/${id}`, {
      method: "DELETE",
    });

    router.push("/fees");
  };

  return (
    <form
      onSubmit={update}
      className="max-w-xl bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-semibold">Edit Fee</h2>

      <input
        className="w-full border p-2 rounded"
        value={form.student_id}
        onChange={(e) =>
          setForm({ ...form, student_id: e.target.value })
        }
      />

      <input
        type="number"
        className="w-full border p-2 rounded"
        value={form.amount}
        onChange={(e) =>
          setForm({ ...form, amount: e.target.value })
        }
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

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded flex-1"
        >
          Update
        </button>

        <button
          type="button"
          onClick={remove}
          className="bg-red-600 text-white px-4 py-2 rounded flex-1"
        >
          Delete
        </button>
      </div>
    </form>
  );
}
