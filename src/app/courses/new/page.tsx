"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

export default function NewCoursePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", code: "", credits: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch("/api/courses", {
      method: "POST",
      body: JSON.stringify({ ...form, credits: Number(form.credits) }),
    });
    router.push("/courses");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Add Course</h2>

      <input placeholder="Name" className="w-full border p-2 rounded"
        onChange={(e) => setForm({ ...form, name: e.target.value })} />

      <input placeholder="Code" className="w-full border p-2 rounded"
        onChange={(e) => setForm({ ...form, code: e.target.value })} />

      <input type="number" placeholder="Credits" className="w-full border p-2 rounded"
        onChange={(e) => setForm({ ...form, credits: e.target.value })} />

      <button
  type="submit"
  className="bg-blue-600 text-white px-4 py-2 rounded w-full"
>
  Create
</button>


    </form>
  );
}
