import { bot } from "@/lib/bot";
import { webhookCallback } from "grammy";

export const dynamic = "force-dynamic";

export const POST = webhookCallback(bot, "std/http");
