import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../src/server/db/index";
import { results } from "../../../../src/server/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

// GET all results
export async function GET() {
  const allResults = await db.select().from(results);
  return NextResponse.json(allResults);
}

// POST new result
export async function POST(req: NextRequest) {
  const data = await req.json();
  const newResult = await db.insert(results).values({
    id: uuidv4(),
    student_id: data.student_id,
    course_id: data.course_id,
    exam_type: data.exam_type,
    marks_obtained: data.marks_obtained,
    max_marks: data.max_marks,
  }).returning();
  return NextResponse.json(newResult);
}

// PUT result
export async function PUT(req: NextRequest) {
  const data = await req.json();
  const updatedResult = await db.update(results).set({
    marks_obtained: data.marks_obtained,
    max_marks: data.max_marks,
    exam_type: data.exam_type,
  }).where(eq(results.id, data.id)).returning();
  return NextResponse.json(updatedResult);
}

// DELETE result
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await db.delete(results).where(eq(results.id, id));
  return NextResponse.json({ success: true });
}
