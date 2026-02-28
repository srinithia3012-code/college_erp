import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../src/server/db/index";
import { fees } from "../../../../src/server/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

// GET all fees
export async function GET() {
  const allFees = await db.select().from(fees);
  return NextResponse.json(allFees);
}

// POST new fee
export async function POST(req: NextRequest) {
  const data = await req.json();
  const newFee = await db.insert(fees).values({
    id: uuidv4(),
    student_id: data.student_id,
    amount: data.amount,
    status: data.status,
    paid_on: data.paid_on,
  }).returning();
  return NextResponse.json(newFee);
}

// PUT fee
export async function PUT(req: NextRequest) {
  const data = await req.json();
  const updatedFee = await db.update(fees).set({
    amount: data.amount,
    status: data.status,
    paid_on: data.paid_on,
  }).where(eq(fees.id, data.id)).returning();
  return NextResponse.json(updatedFee);
}

// DELETE fee
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await db.delete(fees).where(eq(fees.id, id));
  return NextResponse.json({ success: true });
}
