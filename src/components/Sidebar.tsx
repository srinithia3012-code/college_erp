"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r p-4">
      <h2 className="text-xl font-semibold mb-6">College ERP</h2>

      <nav className="space-y-3">
        <Link href="/" className="block hover:text-blue-600">
          Dashboard
        </Link>
        <Link href="/students" className="block hover:text-blue-600">
          Students
        </Link>
        <Link href="/faculty" className="block hover:text-blue-600">
          Faculty
        </Link>
        <Link href="/courses" className="block hover:text-blue-600">
          Courses
        </Link>
        <Link href="/fees" className="block hover:text-blue-600">
          Fees
        </Link>
      </nav>
    </aside>
  );
}
