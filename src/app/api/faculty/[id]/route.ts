import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db/index";
import { faculty } from "@/server/db/schema";
import { eq } from "drizzle-orm";

// API for a single faculty by ID (GET, PUT, DELETE)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // optional fallback if needed

    // You can also get id from pathname for dynamic route
    const pathParts = req.url.split("/");
    const facultyId = pathParts[pathParts.length - 1];

    if (!facultyId) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const [facultyData] = await db.select().from(faculty).where(eq(faculty.id, facultyId));
    if (!facultyData) return NextResponse.json({ error: "Faculty not found" }, { status: 404 });

    return NextResponse.json(facultyData);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch faculty" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest,{ params }: RouteContext<'/api/faculty/[id]'>) {
  try {
    const data = await req.json();  
    const id = (await params).id;
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const [updated] = await db
      .update(faculty)
      .set({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        department: data.department,
      })
      .where(eq(faculty.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update faculty" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest,{ params }: RouteContext<'/api/faculty/[id]'>) {
  try {
    const { id } = (await params)
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await db.delete(faculty).where(eq(faculty.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete faculty" }, { status: 500 });
  }
}
