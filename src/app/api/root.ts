import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db/index";
import { students } from "@/server/db/schema";
import { v4 as uuidv4 } from "uuid";

// GET all students
export async function GET() {
  try {
    const allStudents = await db.select().from(students);
    return NextResponse.json(allStudents); // ALWAYS an array
  } catch (err) {
    console.error("Failed to fetch students:", err);
    return NextResponse.json([], { status: 500 });
  }
}

// POST new student
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newStudent = await db
      .insert(students)
      .values({
        id: uuidv4(),
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password || "",       // if schema requires
        enrollment_no: data.enrollment_no || "",
        course_id: data.course_id || null,
      })
      .returning();

    return NextResponse.json(newStudent[0]); // return inserted student
  } catch (err) {
    console.error("Failed to create student:", err);
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}
