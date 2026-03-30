import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../src/server/db/index";
import { courses } from "../../../../src/server/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

// GET all courses or single course by id
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const courseId = url.searchParams.get("id");

  if (courseId) {
    const [courseData] = await db.select().from(courses).where(eq(courses.id, courseId));
    if (!courseData) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(courseData);
  }

  const allCourses = await db.select().from(courses);
  return NextResponse.json(allCourses);
}

// POST new course
export async function POST(req: NextRequest) {
  const data = await req.json();

  if (!data.name || !data.code) {
    return NextResponse.json({ error: "Name and code are required" }, { status: 400 });
  }

  if (!data.faculty_id) {
    return NextResponse.json({ error: "faculty_id is required" }, { status: 400 });
  }

  const newCourse = await db.insert(courses).values({
    id: uuidv4(),
    name: data.name,
    code: data.code,
    description: data.description ?? null,
    faculty_id: data.faculty_id,
  }).returning();

  return NextResponse.json(newCourse);
}

// PUT course
export async function PUT(req: NextRequest) {
  const data = await req.json();

  if (!data.id) {
    return NextResponse.json({ error: "id is required for update" }, { status: 400 });
  }

  if (!data.faculty_id) {
    return NextResponse.json({ error: "faculty_id is required" }, { status: 400 });
  }

  const updatedCourse = await db.update(courses).set({
    name: data.name,
    code: data.code,
    description: data.description ?? null,
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
