"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function FormActions({ formId }: { formId: string }) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this form and all its data?")) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/forms/${formId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("Failed to delete form");
            }
        } catch (e) {
            console.error(e);
            alert("Error deleting form");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="flex gap-3 text-sm">
            <Link
                href={`/dashboard/forms/${formId}/edit`}
                className="text-indigo-400 hover:text-indigo-300 transition"
            >
                Edit
            </Link>
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-400 hover:text-red-300 transition disabled:opacity-50"
            >
                {deleting ? "..." : "Delete"}
            </button>
        </div>
    );
}
