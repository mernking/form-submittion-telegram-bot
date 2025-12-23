import { db } from "@/lib/db";
import { forms, submissions, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { bot } from "@/lib/bot";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formId = id; // Changed from parseInt(id)

    const form = await db.query.forms.findFirst({
      where: eq(forms.id, formId),
    });

    if (!form || !form.isPublic) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({ form });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // formId
    const { answers } = await request.json();

    if (!answers) {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    const formId = id; // Changed from parseInt(id)

    // Get form and owner
    const form = await db.query.forms.findFirst({
      where: eq(forms.id, formId),
      with: {
        // We can't easily query related user without setting up relations in schema.ts properly using `text` helper or `relations`
        // But let's just do a manual query for now to be safe.
      } as any,
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Save submission
    await db.insert(submissions).values({
      formId,
      answers,
    });

    // Notify owner
    const owner = await db.query.users.findFirst({
      where: eq(users.id, form.userId),
    });

    if (owner && owner.telegramId) {
      let message = `📝 <b>New Submission for "${form.title}"</b>\n\n`;

      // Parse answers (assuming simplified Key-Value pair for notification)
      // The answers object structure depends on the frontend.
      // Let's assume it is { "question_id": "answer" } or similar.
      // But we stored questions as JSON array in form.

      const questions = form.questions as any[]; // [{id, text, type}, ...]

      questions.forEach((q) => {
        const answer = answers[q.id];
        if (answer) {
          message += `<b>${q.text}</b>\n${answer}\n\n`;
        }
      });

      try {
        await bot.api.sendMessage(owner.telegramId, message, {
          parse_mode: "HTML",
        });
      } catch (e) {
        console.error("Failed to send telegram message:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
