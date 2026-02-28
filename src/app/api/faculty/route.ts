import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../src/server/db/index";
import { faculty } from "../../../../src/server/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

// GET all faculty
export async function GET() {
  const allFaculty = await db.select().from(faculty);
  return NextResponse.json(allFaculty);
}

// POST new faculty
export async function POST(req: NextRequest) {
  const data = await req.json();
  const newFaculty = await db.insert(faculty).values({
    id: uuidv4(),
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    password: data.password,
    department: data.department,
  }).returning();
  return NextResponse.json(newFaculty);
}

// PUT faculty
export async function PUT(req: NextRequest) {
  const data = await req.json();
  const updatedFaculty = await db.update(faculty).set({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    department: data.department,
  }).where(eq(faculty.id, data.id)).returning();
  return NextResponse.json(updatedFaculty);
}

// DELETE faculty
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await db.delete(faculty).where(eq(faculty.id, id));
  return NextResponse.json({ success: true });
}
