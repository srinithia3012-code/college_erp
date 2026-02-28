import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db/index";
import { students } from "@/server/db/schema";
import { eq } from "drizzle-orm";

// 1. Define a shared type for the async context
type RouteContext = { params: Promise<{ id: string }> };

// GET single student by id
export async function GET(
  _req: NextRequest,
  context: RouteContext // Updated type
) {
  try {
    // 2. Await the params before using 'id'
    const { id } = await context.params;

    const student = await db
      .select()
      .from(students)
      .where(eq(students.id, id));

    if (!student || student.length === 0) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student[0]);
  } catch (err) {
    console.error("Failed to fetch student:", err);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

// PUT update student
export async function PUT(
  req: NextRequest,
  context: RouteContext // Updated type
) {
  try {
    const { id } = await context.params; // Await params
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
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0]);
  } catch (err) {
    console.error("Failed to update student:", err);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

// DELETE single student
export async function DELETE(
  _req: NextRequest,
  context: RouteContext // Updated type
) {
  try {
    const { id } = await context.params; // Await params

    await db.delete(students).where(eq(students.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete student:", err);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}