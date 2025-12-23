import { Bot, InlineKeyboard } from "grammy";
import { db } from "./db";
import { users, forms } from "./db/schema";
import { eq, like, and } from "drizzle-orm";

export const bot = new Bot(
  process.env.TELEGRAM_BOT_TOKEN || "dummy_token_for_build"
);

bot.command("start", async (ctx) => {
  const telegramId = ctx.from?.id;
  const username = ctx.from?.username || ctx.from?.first_name;
  const payload = ctx.match; // The parameter after /start

  if (!telegramId) return;

  if (payload) {
    // Try to find user with this linking token
    const userToLink = await db
      .select()
      .from(users)
      .where(eq(users.linkingToken, payload as string))
      .limit(1);

    if (userToLink.length > 0) {
      const user = userToLink[0];
      await db
        .update(users)
        .set({ telegramId: telegramId, linkingToken: null }) // Clear token after use
        .where(eq(users.id, user.id));

      await ctx.reply(
        `Successfully linked to account: ${user.username || user.email}`
      );
    } else {
      await ctx.reply("Invalid or expired linking token.");
    }
  } else {
    // Check if user exists by telegram ID
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.telegramId, telegramId));

    if (existingUser.length > 0) {
      await ctx.reply(
        "Welcome back! Your account is managed via the web dashboard."
      );
    } else {
      await ctx.reply(
        "Welcome! To use this boundless form bot, please sign up on the website and link your Telegram account via the Settings page."
      );
    }
  }
});
bot.command("list", async (ctx) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const user = await db.query.users.findFirst({
    where: eq(users.telegramId, telegramId),
  });

  if (!user) {
    return ctx.reply("Please link your account first via the website.");
  }

  const userForms = await db
    .select()
    .from(forms)
    .where(eq(forms.userId, user.id));

  if (userForms.length === 0) {
    return ctx.reply("You haven't created any forms yet.");
  }

  let message = "<b>Your Forms:</b>\n\n";
  const keyboard = new InlineKeyboard();

  userForms.forEach((f, i) => {
    message += `${i + 1}. <b>${f.title}</b> (ID: ${f.id})\n`;
    message += `   /get_link_${f.id}\n\n`;

    // Add button for each form (limit to first 5 to avoid clutter, or row by row)
    if (i < 5) {
      keyboard
        .url(
          `View ${f.title}`,
          `${process.env.NEXT_PUBLIC_APP_URL}/submit/${f.id}`
        )
        .row();
    }
  });

  await ctx.reply(message, { parse_mode: "HTML", reply_markup: keyboard });
});

bot.command("search", async (ctx) => {
  const telegramId = ctx.from?.id;
  const query = ctx.match;

  if (!telegramId) return;
  if (!query)
    return ctx.reply("Please provide a search term. Example: /search Feedback");

  const user = await db.query.users.findFirst({
    where: eq(users.telegramId, telegramId),
  });

  if (!user) {
    return ctx.reply("Please link your account first via the website.");
  }

  const userForms = await db
    .select()
    .from(forms)
    .where(and(eq(forms.userId, user.id), like(forms.title, `%${query}%`)));

  if (userForms.length === 0) {
    return ctx.reply("No forms found matching your query.");
  }

  let message = `<b>Found ${userForms.length} forms matching "${query}":</b>\n\n`;
  const keyboard = new InlineKeyboard();

  userForms.forEach((f, i) => {
    message += `${i + 1}. <b>${f.title}</b>\n`;
    if (i < 5) {
      keyboard
        .url(
          `Open ${f.title}`,
          `${process.env.NEXT_PUBLIC_APP_URL}/submit/${f.id}`
        )
        .row();
    }
  });

  await ctx.reply(message, { parse_mode: "HTML", reply_markup: keyboard });
});

// Helper command to get link just by clicking command from list
bot.hears(/^\/get_link_([a-zA-Z0-9_-]+)$/, async (ctx) => {
  const formId = ctx.match[1];
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/submit/${formId}`;
  await ctx.reply(`Here is the link for your form:\n${url}`);
});
