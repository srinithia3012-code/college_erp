"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

export default function NewResultPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    student_id: "",
    course_id: "",
    marks: "",
    grade: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await apiFetch("/api/results", {
        method: "POST",
        body: JSON.stringify({
          student_id: Number(form.student_id),
          course_id: Number(form.course_id),
          marks: Number(form.marks),
          grade: form.grade,
        }),
      });

      router.push("/result");
    } catch {
      setError("Failed to create result");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={create}
      className="max-w-xl bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-semibold">Add Result</h2>

      {error && <p className="text-red-600">{error}</p>}

      <input
        type="number"
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
        placeholder="Course ID"
        className="w-full border p-2 rounded"
        value={form.course_id}
        onChange={(e) =>
          setForm({ ...form, course_id: e.target.value })
        }
        required
      />

      <input
        type="number"
        placeholder="Marks"
        className="w-full border p-2 rounded"
        value={form.marks}
        onChange={(e) =>
          setForm({ ...form, marks: e.target.value })
        }
        required
      />

      <input
        placeholder="Grade"
        className="w-full border p-2 rounded"
        value={form.grade}
        onChange={(e) =>
          setForm({ ...form, grade: e.target.value })
        }
        required
      />

      <button
        type="submit"
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {saving ? "Saving..." : "Create"}
      </button>
    </form>
  );
}
