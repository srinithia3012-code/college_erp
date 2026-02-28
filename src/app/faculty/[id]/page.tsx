"use client"; // Required for React hooks

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

type FacultyForm = {
  first_name: string;
  last_name: string;
  email: string;
  department: string;
};

export default function EditFacultyPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<FacultyForm>({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch faculty safely
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchFaculty = async () => {
      try {
        const data = await apiFetch(`/api/faculty/${id}`);
        setForm({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          department: data.department,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load faculty data");
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await apiFetch(`/api/faculty/${id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      router.push("/faculty");
    } catch (err) {
      console.error(err);
      setError("Failed to update faculty");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this faculty?")) return;

    try {
      await apiFetch(`/api/faculty/${id}`, { method: "DELETE" });
      router.push("/faculty");
    } catch (err) {
      console.error(err);
      setError("Failed to delete faculty");
    }
  };

  if (loading) return <p className="text-gray-500">Loading faculty data...</p>;

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Faculty</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          required
          placeholder="First Name"
          className="w-full border p-2 rounded"
        />
        <input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          required
          placeholder="Last Name"
          className="w-full border p-2 rounded"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <input
          name="department"
          value={form.department}
          onChange={handleChange}
          required
          placeholder="Department"
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded flex-1"
          >
            {saving ? "Updating..." : "Update"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded flex-1"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
