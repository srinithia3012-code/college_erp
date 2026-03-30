"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

type StudentForm = { first_name: string; last_name: string; email: string; enrollment_no: string; course_id?: string; phone?: string; address?: string };

export default function EditStudentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<StudentForm>({
    first_name: "",
    last_name: "",
    email: "",
    enrollment_no: "",
    course_id: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return setLoading(false);

    apiFetch(`/api/students/${id}`)
      .then((data) => {
        if (!data?.id) setError("Student not found");
        else
          setForm({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || "",
            enrollment_no: data.enrollment_no || "",
            course_id: data.course_id || "",
            phone: data.phone || "",
            address: data.address || "",
          });
      })
      .catch(() => setError("Failed to load student data"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await apiFetch(`/api/students/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          phone: form.phone,
          address: form.address,
        }),
      });
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
        <div className="grid grid-cols-1 gap-2">
          <label className="text-sm text-gray-700">Name</label>
          <p className="bg-gray-100 border border-gray-200 p-2 rounded">{form.first_name} {form.last_name}</p>

          <label className="text-sm text-gray-700">Email</label>
          <p className="bg-gray-100 border border-gray-200 p-2 rounded">{form.email}</p>

          <label className="text-sm text-gray-700">Enrollment No</label>
          <p className="bg-gray-100 border border-gray-200 p-2 rounded">{form.enrollment_no}</p>
        </div>

        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" className="w-full border p-2 rounded" />
        <textarea name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full border p-2 rounded" />
        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">
          {saving ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}
