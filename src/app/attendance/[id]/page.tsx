"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

export default function EditAttendancePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState({
    student_id: "",
    course_id: "",
    date: "",
    status: "",
  });

  useEffect(() => {
    if (!id) return;

    apiFetch(`/api/attendance/${id}`).then((data) =>
      setForm({
        student_id: data.student_id,
        course_id: data.course_id,
        date: data.date.split("T")[0],
        status: data.status,
      })
    );
  }, [id]);

  const update = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await apiFetch(`/api/attendance/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    router.push("/attendance");
  };

  const remove = async () => {
    await apiFetch(`/api/attendance/${id}`, {
      method: "DELETE",
    });

    router.push("/attendance");
  };

  return (
    <form
      onSubmit={update}
      className="max-w-xl bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-semibold">Edit Attendance</h2>

      <input
        className="w-full border p-2 rounded"
        value={form.student_id}
        onChange={(e) =>
          setForm({ ...form, student_id: e.target.value })
        }
      />

      <input
        className="w-full border p-2 rounded"
        value={form.course_id}
        onChange={(e) =>
          setForm({ ...form, course_id: e.target.value })
        }
      />

      <input
        type="date"
        className="w-full border p-2 rounded"
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
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
