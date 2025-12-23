import { db } from "@/lib/db";
import { forms, submissions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const formId = id; // Changed from parseInt

  const form = await db.query.forms.findFirst({
    where: and(eq(forms.id, formId), eq(forms.userId, session.user.id)),
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  return NextResponse.json({ form });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const formId = id; // Changed from parseInt
    const { title, description, questions } = await request.json();

    // Verify ownership
    const existingForm = await db.query.forms.findFirst({
      where: and(eq(forms.id, formId), eq(forms.userId, session.user.id)),
    });

    if (!existingForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const [updatedForm] = await db
      .update(forms)
      .set({
        title,
        description,
        questions,
      })
      .where(eq(forms.id, formId))
      .returning();

    return NextResponse.json({ form: updatedForm });
  } catch (error) {
    console.error("Update form error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const formId = id; // Changed from parseInt

    // Verify ownership
    const existingForm = await db.query.forms.findFirst({
      where: and(eq(forms.id, formId), eq(forms.userId, session.user.id)),
    });

    if (!existingForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Since we enabled ON DELETE CASCADE in schema, deleting form should delete submissions.
    // However, SQLite sometimes needs PRAGMA foreign_keys = ON; enabled.
    // Drizzle client usually handles this, but to be safe and explicit (and if cascade fails),
    // we could manually delete submissions first. But let's trust Cascade if set up correctly.
    // Actually, `libsql` / `sqlite` default might have it off.
    // Let's do manual deletion just to be 100% sure without relying on DB config.

    await db.delete(submissions).where(eq(submissions.formId, formId));
    await db.delete(forms).where(eq(forms.id, formId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete form error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
