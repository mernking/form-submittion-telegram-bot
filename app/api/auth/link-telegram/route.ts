import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const linkingToken = nanoid(32); // specific token for linking

    // Store token in DB
    await db
      .update(users)
      .set({ linkingToken })
      .where(eq(users.id, session.user.id));

    // Construct deep link
    // Assuming TELEGRAM_BOT_USERNAME is set in env, e.g. "MySuperBot"
    const botUsername =
      process.env.NEXT_PUBLIC_BOT_USERNAME || "your_bot_username";
    const linkUrl = `https://t.me/${botUsername}?start=${linkingToken}`;

    return NextResponse.json({ linkUrl });
  } catch (error) {
    console.error("Link telegram error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
