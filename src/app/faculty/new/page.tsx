"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

interface FacultyForm {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  password?: string;
}

export default function NewFacultyPage({ existingData }: { existingData?: FacultyForm }) {
  const router = useRouter();

  const [form, setForm] = useState<FacultyForm>({
    first_name: existingData?.first_name || "",
    last_name: existingData?.last_name || "",
    email: existingData?.email || "",
    department: existingData?.department || "",
    password: "", // empty by default for edit
    id: existingData?.id,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const method = form.id ? "PUT" : "POST"; // if id exists → edit
      const res = await apiFetch("/api/faculty", {
        method,
        body: JSON.stringify(form),
      });

      if (!res) throw new Error("Failed to save faculty");

      router.push("/faculty"); // redirect after save
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{form.id ? "Edit Faculty" : "Add Faculty"}</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="password"
          type="password"
          placeholder={form.id ? "New Password (leave blank to keep current)" : "Password"}
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Saving..." : form.id ? "Update Faculty" : "Create Faculty"}
        </button>
      </form>
    </div>
  );
}
