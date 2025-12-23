"use client";

import { useState } from "react";

export default function LinkTelegramButton() {
    const [loading, setLoading] = useState(false);
    const [linkUrl, setLinkUrl] = useState<string | null>(null);

    const handleLink = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/link-telegram", { method: "POST" });
            if (res.ok) {
                const data = await res.json();
                setLinkUrl(data.linkUrl);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (linkUrl) {
        return (
            <div className="space-y-4">
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                    <p className="text-sm text-indigo-300 mb-3">
                        Click the button below to open Telegram and link your account:
                    </p>
                    <a
                        href={linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                        </svg>
                        Open Telegram
                    </a>
                </div>
                <p className="text-xs text-zinc-500">
                    After linking, refresh this page to confirm.
                </p>
            </div>
        );
    }

    return (
        <button
            onClick={handleLink}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
            {loading ? "Generating link..." : "Link Telegram Account"}
        </button>
    );
}
