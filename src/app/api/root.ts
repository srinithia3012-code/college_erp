/** biome-ignore-all assist/source/organizeImports: <explanation> */
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db/index";
import { students } from "@/server/db/schema";
import { v4 as uuidv4 } from "uuid";
// 1. Add this import to get the router creator
// Added publicProcedure import to support the fix below
import { createTRPCRouter, publicProcedure } from "./trpc"; 

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

// --- ADDED FOR TRPC COMPATIBILITY ---

// 2. Define the appRouter
// FIX: Added a dummy procedure so tRPC recognizes this as a valid router
export const appRouter = createTRPCRouter({
  healthcheck: publicProcedure.query(() => "ok"),
});

// 3. Export the missing AppRouter type
export type AppRouter = typeof appRouter;

// 4. Export the caller (optional but good practice)
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const createCaller = (ctx: any) => appRouter.createCaller(ctx);