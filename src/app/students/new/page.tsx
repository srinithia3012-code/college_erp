"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

type Course = { id: string; name: string; code: string };

type StudentForm = {
  first_name: string;
  last_name: string;
  email: string;
  enrollment_no: string;
  course_id: string;
};

export default function NewStudentPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<StudentForm>({
    first_name: "",
    last_name: "",
    email: "",
    enrollment_no: "",
    course_id: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch("/api/courses");
        setCourses(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses. Add a course first.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.course_id) {
      setError("Please select a course");
      return;
    }

    try {
      await apiFetch("/api/students", {
        method: "POST",
        body: JSON.stringify(form),
      });
      router.push("/students");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create student");
    }
  };

  if (loading) return <p className="text-gray-500">Loading courses...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add Student</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="first_name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
          placeholder="First Name"
          className="w-full border rounded p-2"
        />
        <input
          name="last_name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          required
          placeholder="Last Name"
          className="w-full border rounded p-2"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          placeholder="Email"
          className="w-full border rounded p-2"
        />
        <input
          name="enrollment_no"
          value={form.enrollment_no}
          onChange={(e) => setForm({ ...form, enrollment_no: e.target.value })}
          required
          placeholder="Enrollment No"
          className="w-full border rounded p-2"
        />
        <select
          value={form.course_id}
          onChange={(e) => setForm({ ...form, course_id: e.target.value })}
          required
          className="w-full border rounded p-2"
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.code})
            </option>
          ))}
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white rounded p-2">
          Add Student
        </button>
      </form>
    </div>
  );
}

