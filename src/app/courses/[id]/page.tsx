"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

type Faculty = {
  id: string;
  first_name: string;
  last_name: string;
};

type Course = {
  id: string;
  name: string;
  code: string;
  description: string;
  faculty_id: string;
};

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    faculty_id: "",
  });

  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch course and faculty list
  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      try {
        const [courseData, facultyData] = await Promise.all([
          apiFetch(`/api/courses?id=${id}`),
          apiFetch("/api/faculty"),
        ]);

        const course = courseData as Course;
        setForm({
          name: course.name,
          code: course.code,
          description: course.description || "",
          faculty_id: course.faculty_id || "",
        });

        setFacultyList(facultyData as Faculty[]);
      } catch (err) {
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  // Update course
  const update = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!form.faculty_id) {
      setError("Please select a faculty for this course.");
      setSaving(false);
      return;
    }

    try {
      await apiFetch("/api/courses", {
        method: "PUT",
        body: JSON.stringify({
          id,
          ...form,
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
      await apiFetch("/api/courses", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
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

      <textarea
        value={form.description}
        placeholder="Description"
        className="w-full border p-2 rounded"
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <select
        value={form.faculty_id}
        onChange={(e) => setForm({ ...form, faculty_id: e.target.value })}
        required
        className="w-full border p-2 rounded"
      >
        <option value="">Select Faculty</option>
        {facultyList.map((faculty) => (
          <option key={faculty.id} value={faculty.id}>
            {faculty.first_name} {faculty.last_name}
          </option>
        ))}
      </select>

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
