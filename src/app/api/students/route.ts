import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db/index";
import { students } from "@/server/db/schema";
import { eq } from "drizzle-orm";

// GET all students
export async function GET(_req: NextRequest) {
  try {
    const allStudents = await db.select().from(students);
    return NextResponse.json(allStudents);
  } catch (err) {
    console.error("Failed to fetch student:", err);
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
  }
}

// PUT update student
export async function PUT(
  req: NextRequest, 
  context: { params: Promise<{ id: string }> } // Fix: Change to Promise
) {
  try {
    const { id } = await context.params; // Fix: Await the promise
    const body = await req.json();

    const updated = await db
      .update(students)
      .set({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
      })
      .where(eq(students.id, id))
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
export async function DELETE(
  req: NextRequest, 
  context: { params: Promise<{ id: string }> } // Fix: Change to Promise
) {
  try {
    const { id } = await context.params; // Fix: Await the promise

    await db.delete(students).where(eq(students.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete student:", err);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}