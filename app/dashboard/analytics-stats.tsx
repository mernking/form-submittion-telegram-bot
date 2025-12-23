import { db } from "@/lib/db";
import { forms, submissions } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export default async function AnalyticsStats() {
    const session = await getSession();

    // Total Forms
    const [formsCount] = await db
        .select({ value: count() })
        .from(forms)
        .where(eq(forms.userId, session.user.id));

    // Fetch user forms to get IDs for submission count
    const userForms = await db
        .select({ id: forms.id })
        .from(forms)
        .where(eq(forms.userId, session.user.id));

    let totalSubmissions = 0;

    // This is N+1 but efficient enough for sqlite with small datasets. 
    // For larger scale, we'd do a join or separate aggregation query.
    for (const f of userForms) {
        const [subCount] = await db
            .select({ value: count() })
            .from(submissions)
            .where(eq(submissions.formId, f.id));
        totalSubmissions += subCount.value;
    }

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 dark:bg-zinc-900">
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Forms
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {formsCount.value}
                </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 dark:bg-zinc-900">
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Submissions
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {totalSubmissions}
                </dd>
            </div>
        </div>
    );
}
