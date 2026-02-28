import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../src/server/db/index";
import { attendance } from "../../../../src/server/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

// GET all attendance
export async function GET() {
  const allAttendance = await db.select().from(attendance);
  return NextResponse.json(allAttendance);
}

// POST new attendance
export async function POST(req: NextRequest) {
  const data = await req.json();
  const newRecord = await db.insert(attendance).values({
    id: uuidv4(),
    student_id: data.student_id,
    course_id: data.course_id,
    date: data.date,
    status: data.status,
  }).returning();
  return NextResponse.json(newRecord);
}

// PUT attendance
export async function PUT(req: NextRequest) {
  const data = await req.json();
  const updatedRecord = await db.update(attendance).set({
    status: data.status,
    date: data.date,
  }).where(eq(attendance.id, data.id)).returning();
  return NextResponse.json(updatedRecord);
}

// DELETE attendance
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await db.delete(attendance).where(eq(attendance.id, id));
  return NextResponse.json({ success: true });
}
