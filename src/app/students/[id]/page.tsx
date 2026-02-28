"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

type StudentForm = { first_name: string; last_name: string; email: string };

export default function EditStudentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<StudentForm>({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return setLoading(false);

    apiFetch(`/api/students/${id}`)
      .then((data) => {
        if (!data?.id) setError("Student not found");
        else setForm({ first_name: data.first_name, last_name: data.last_name, email: data.email });
      })
      .catch(() => setError("Failed to load student data"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await apiFetch(`/api/students/${id}`, { method: "PUT", body: JSON.stringify(form) });
      router.push("/students");
    } catch {
      setError("Failed to update student");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading student data...</p>;

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Student</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleUpdate} className="space-y-4">
        <input name="first_name" value={form.first_name} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="last_name" value={form.last_name} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border p-2 rounded" />
        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">
          {saving ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}
