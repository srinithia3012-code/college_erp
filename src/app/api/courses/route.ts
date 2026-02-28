import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../src/server/db/index";
import { courses } from "../../../../src/server/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

// GET all courses
export async function GET() {
  const allCourses = await db.select().from(courses);
  return NextResponse.json(allCourses);
}

// POST new course
export async function POST(req: NextRequest) {
  const data = await req.json();
  const newCourse = await db.insert(courses).values({
    id: uuidv4(),
    name: data.name,
    code: data.code,
    description: data.description,
    faculty_id: data.faculty_id,
  }).returning();
  return NextResponse.json(newCourse);
}

// PUT course
export async function PUT(req: NextRequest) {
  const data = await req.json();
  const updatedCourse = await db.update(courses).set({
    name: data.name,
    code: data.code,
    description: data.description,
    faculty_id: data.faculty_id,
  }).where(eq(courses.id, data.id)).returning();
  return NextResponse.json(updatedCourse);
}

// DELETE course
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await db.delete(courses).where(eq(courses.id, id));
  return NextResponse.json({ success: true });
}
