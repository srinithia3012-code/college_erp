"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

type Faculty = {
  id: string;
  first_name: string;
  last_name: string;
};

export default function NewCoursePage() {
  const router = useRouter();
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loadingFaculty, setLoadingFaculty] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    faculty_id: "",
  });

  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const data: Faculty[] = await apiFetch("/api/faculty");
        setFacultyList(data);
      } catch (e) {
        setError("Failed to load faculty data. Please add faculty first.");
      } finally {
        setLoadingFaculty(false);
      }
    };

    loadFaculty();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.faculty_id) {
      setError("Please choose a faculty for this course.");
      return;
    }

    try {
      await apiFetch("/api/courses", {
        method: "POST",
        body: JSON.stringify(form),
      });
      router.push("/courses");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create course");
      }
    }
  };

  if (loadingFaculty) {
    return <p className="text-gray-500">Loading faculty...</p>;
  }

  if (!facultyList || facultyList.length === 0) {
    return (
      <div className="max-w-xl bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">No Faculty Available</h2>
        <p className="text-gray-600">You need to add faculty before creating a course.</p>
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => router.push("/faculty/new")}
        >
          Add Faculty
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Add Course</h2>

      {error && <p className="text-red-500">{error}</p>}

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        className="w-full border p-2 rounded"
      />

      <input
        placeholder="Code"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value })}
        required
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full border p-2 rounded"
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

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Create
      </button>
    </form>
  );
}
