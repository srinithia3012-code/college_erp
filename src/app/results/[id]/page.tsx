"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

type Result = {
  student_id: number;
  course_id: number;
  marks: number;
  grade: string;
};

export default function EditResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [form, setForm] = useState({
    student_id: "",
    course_id: "",
    marks: "",
    grade: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    apiFetch(`/api/results/${id}`)
      .then((data: Result) =>
        setForm({
          student_id: data.student_id.toString(),
          course_id: data.course_id.toString(),
          marks: data.marks.toString(),
          grade: data.grade,
        })
      )
      .catch(() => setError("Failed to load result"))
      .finally(() => setLoading(false));
  }, [id]);

  const update = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await apiFetch(`/api/results/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          student_id: Number(form.student_id),
          course_id: Number(form.course_id),
          marks: Number(form.marks),
          grade: form.grade,
        }),
      });

      router.push("/result");
    } catch {
      setError("Failed to update result");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm("Delete this result?")) return;

    try {
      await apiFetch(`/api/results/${id}`, { method: "DELETE" });
      router.push("/result");
    } catch {
      setError("Failed to delete result");
    }
  };

  if (loading) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <form
      onSubmit={update}
      className="max-w-xl bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-semibold">Edit Result</h2>

      {error && <p className="text-red-600">{error}</p>}

      <input
        type="number"
        className="w-full border p-2 rounded"
        value={form.student_id}
        onChange={(e) =>
          setForm({ ...form, student_id: e.target.value })
        }
        required
      />

      <input
        type="number"
        className="w-full border p-2 rounded"
        value={form.course_id}
        onChange={(e) =>
          setForm({ ...form, course_id: e.target.value })
        }
        required
      />

      <input
        type="number"
        className="w-full border p-2 rounded"
        value={form.marks}
        onChange={(e) =>
          setForm({ ...form, marks: e.target.value })
        }
        required
      />

      <input
        className="w-full border p-2 rounded"
        value={form.grade}
        onChange={(e) =>
          setForm({ ...form, grade: e.target.value })
        }
        required
      />

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded flex-1 disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update"}
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
