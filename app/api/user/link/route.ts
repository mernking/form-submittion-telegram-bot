import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import crypto from "crypto";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Generate a random token
  const token = crypto.randomBytes(16).toString("hex");

  // Save to user record
  await db
    .update(users)
    .set({ linkingToken: token })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ token });
}
