import { db } from "@/lib/db";
import { forms, submissions } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
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
  const formId = id;

  // Verify ownership
  const form = await db.query.forms.findFirst({
    where: and(eq(forms.id, formId), eq(forms.userId, session.user.id)),
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  // Fetch all submissions
  const allSubmissions = await db
    .select()
    .from(submissions)
    .where(eq(submissions.formId, formId))
    .orderBy(desc(submissions.submittedAt));

  // Generate CSV
  const questions = form.questions as any[]; // [{id, text, type}]

  // Header row
  const header = [
    "Submission ID",
    "Submitted At",
    ...questions.map((q) => q.text),
  ].join(",");

  // Data rows
  const rows = allSubmissions.map((sub) => {
    const answers = sub.answers as any; // { qId: "answer" }
    const answer = questions.map((q) => {
      // Escape quotes and newlines
      const val = answers[q.id] || "";
      return `"${val.replace(/"/g, '""')}"`;
    });

    return [
      `"${sub.id}"`,
      `"${new Date(sub.submittedAt).toISOString()}"`,
      ...answer,
    ].join(",");
  });

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${form.title.replace(
        /[^a-z0-9]/iy,
        "_"
      )}_submissions.csv"`,
    },
  });
}
