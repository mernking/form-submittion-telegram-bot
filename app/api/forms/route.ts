import { db } from "@/lib/db";
import { forms, users } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { eq, like, and, desc, sql, count } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const offset = (page - 1) * limit;

  try {
    const whereClause = and(
      eq(forms.userId, session.user.id as string),
      search ? like(forms.title, `%${search}%`) : undefined
    );

    // Get total count for pagination
    const [totalResult] = await db
      .select({ count: count() })
      .from(forms)
      .where(whereClause);

    const total = totalResult.count;

    // Get data
    const data = await db
      .select()
      .from(forms)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(forms.createdAt));

    return NextResponse.json({
      data,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch forms error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, questions } = await request.json();

    if (!title || !questions) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Verify user exists (in case of stale session after DB reset)
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id as string),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please log out and log in again." },
        { status: 401 }
      );
    }

    const [newForm] = await db
      .insert(forms)
      .values({
        userId: session.user.id,
        title,
        description,
        questions,
        isPublic: true,
      })
      .returning();

    return NextResponse.json({ form: newForm });
  } catch (error) {
    console.error("Create form error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
