"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

export default function NewAttendancePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    student_id: "",
    course_id: "",
    date: "",
    status: "present",
  });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await apiFetch("/api/attendance", {
      method: "POST",
      body: JSON.stringify(form),
    });

    router.push("/attendance");
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-xl bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-semibold">Mark Attendance</h2>

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
        placeholder="Course ID"
        className="w-full border p-2 rounded"
        value={form.course_id}
        onChange={(e) =>
          setForm({ ...form, course_id: e.target.value })
        }
        required
      />

      <input
        type="date"
        className="w-full border p-2 rounded"
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
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
        <option value="present">Present</option>
        <option value="absent">Absent</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Save Attendance
      </button>
    </form>
  );
}
