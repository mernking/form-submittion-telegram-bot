import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import LinkTelegramButton from "./link-telegram-button";

export default async function SettingsPage() {
    const session = await getSession();
    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-2">
                        Telegram Integration
                    </h2>
                    <p className="text-sm text-zinc-400 mb-6">
                        Link your Telegram account to receive form submissions directly in your DMs.
                    </p>

                    {user?.telegramId ? (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <svg
                                    className="w-5 h-5 text-green-400 mt-0.5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <h3 className="text-sm font-medium text-green-400">
                                        Telegram Linked
                                    </h3>
                                    <p className="mt-1 text-sm text-green-300/80">
                                        Your account is linked (ID: {user.telegramId}). You'll receive notifications here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <LinkTelegramButton />
                    )}
                </div>
            </div>
        </div>
    );
}
