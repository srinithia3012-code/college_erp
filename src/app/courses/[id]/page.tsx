"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

type Course = {
  name: string;
  code: string;
  credits: number;
};

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [form, setForm] = useState({
    name: "",
    code: "",
    credits: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch course
  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const data: Course = await apiFetch(`/api/courses/${id}`);
        setForm({
          name: data.name,
          code: data.code,
          credits: data.credits.toString(),
        });
      } catch (err) {
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Update course
  const update = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await apiFetch(`/api/courses/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          credits: Number(form.credits),
        }),
      });

      router.push("/courses");
    } catch (err) {
      setError("Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  // Delete course
  const remove = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    try {
      await apiFetch(`/api/courses/${id}`, { method: "DELETE" });
      router.push("/courses");
    } catch (err) {
      setError("Failed to delete course");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <form
      onSubmit={update}
      className="max-w-xl bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-semibold">Edit Course</h2>

      {error && (
        <p className="text-red-600 text-sm font-medium">{error}</p>
      )}

      <input
        value={form.name}
        placeholder="Course Name"
        className="w-full border p-2 rounded"
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        required
      />

      <input
        value={form.code}
        placeholder="Course Code"
        className="w-full border p-2 rounded"
        onChange={(e) =>
          setForm({ ...form, code: e.target.value })
        }
        required
      />

      <input
        type="number"
        value={form.credits}
        placeholder="Credits"
        className="w-full border p-2 rounded"
        onChange={(e) =>
          setForm({ ...form, credits: e.target.value })
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
