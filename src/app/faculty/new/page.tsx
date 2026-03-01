/** biome-ignore-all assist/source/useSortedAttributes: <explanation> */
"use client";

// biome-ignore assist/source/organizeImports: <explanation>
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

// FIX: Changed from ({ existingData }) to (props: any)
// This satisfies Next.js 15 while keeping your logic working.
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function NewFacultyPage(props: any) {
  // We define existingData here so your useState logic below doesn't break.
  const existingData = props?.existingData as FacultyForm | undefined;
  
  const router = useRouter();

  const [form, setForm] = useState<FacultyForm>({
    first_name: existingData?.first_name || "",
    last_name: existingData?.last_name || "",
    email: existingData?.email || "",
    department: existingData?.department || "",
    password: "", 
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
      const method = form.id ? "PUT" : "POST";
      const res = await apiFetch("/api/faculty", {
        method,
        body: JSON.stringify(form),
      });

      if (!res) throw new Error("Failed to save faculty");

      router.push("/faculty");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl rounded bg-white p-6 shadow">
      <h2 className="mb-4 font-semibold text-xl">{form.id ? "Edit Faculty" : "Add Faculty"}</h2>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
          className="w-full rounded border p-2"
        />

        <input
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
          className="w-full rounded border p-2"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded border p-2"
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
          className="w-full rounded border p-2"
        />

        <input
          name="password"
          type="password"
          placeholder={form.id ? "New Password (leave blank to keep current)" : "Password"}
          value={form.password}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white"
        >
          {loading ? "Saving..." : form.id ? "Update Faculty" : "Create Faculty"}
        </button>
      </form>
    </div>
  );
}