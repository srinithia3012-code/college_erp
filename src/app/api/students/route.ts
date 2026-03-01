// biome-ignore lint/style/useImportType: <explanation>
// biome-ignore assist/source/organizeImports: <explanation>
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
  context: { params: Promise<any> } // Changed { id: string } to any
) {
  try {
    // We await any because this route folder isn't dynamic [id]
    const resolvedParams = await context.params; 
    const id = resolvedParams?.id; 
    
    const body = await req.json();

    const updated = await db
      .update(students)
      .set({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
      })
      .where(eq(students.id, id || body.id)) // Fallback to body.id if param is missing
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
  _req: NextRequest, 
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  context: { params: Promise<any> } // Changed { id: string } to any
) {
  try {
    const resolvedParams = await context.params;
    const id = resolvedParams?.id;

    await db.delete(students).where(eq(students.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete student:", err);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}