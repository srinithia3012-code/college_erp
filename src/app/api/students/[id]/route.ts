import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db/index";
import { students } from "@/server/db/schema";
import { eq } from "drizzle-orm"; // <-- import eq helper

// GET single student by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const student = await db.select().from(students).where(eq(students.id, params.id));
    if (!student || student.length === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(student[0]);
  } catch (err) {
    console.error("Failed to fetch student:", err);
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
  }
}

// PUT update student
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await db
      .update(students)
      .set({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
      })
      .where(eq(students.id, params.id))
      .returning();

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(updated[0]);
  } catch (err) {
    console.error("Failed to update student:", err);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

// DELETE single student
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.delete(students).where(eq(students.id, params.id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete student:", err);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
