import { db } from "@/lib/db";
import { forms, submissions } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();

  // Total Forms
  const [formsCount] = await db
    .select({ value: count() })
    .from(forms)
    .where(eq(forms.userId, session.user.id));

  // Fetch user forms to get IDs for submission count
  const userForms = await db
    .select({ id: forms.id, title: forms.title })
    .from(forms)
    .where(eq(forms.userId, session.user.id))
    .orderBy(desc(forms.createdAt))
    .limit(5);

  let totalSubmissions = 0;

  for (const f of userForms) {
    const [subCount] = await db
      .select({ value: count() })
      .from(submissions)
      .where(eq(submissions.formId, f.id));
    totalSubmissions += subCount.value;
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Total Forms</p>
                <p className="text-4xl font-bold text-white">{formsCount.value}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Total Submissions</p>
                <p className="text-4xl font-bold text-white">{totalSubmissions}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Active Rate</p>
                <p className="text-4xl font-bold text-white">
                  {formsCount.value > 0 ? Math.round((totalSubmissions / formsCount.value) * 10) / 10 : 0}
                </p>
                <p className="text-xs text-zinc-500 mt-1">avg submissions/form</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Forms */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Forms</h2>
            <Link href="/dashboard/forms" className="text-sm text-indigo-400 hover:text-indigo-300 transition">
              View All →
            </Link>
          </div>
          {userForms.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-zinc-500 mb-4">No forms yet</p>
              <Link
                href="/dashboard/forms/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition text-sm font-medium"
              >
                Create Your First Form
              </Link>
            </div>
          ) : (
            <ul>
              {userForms.map((form) => (
                <li key={form.id} className="px-6 py-4 border-b border-zinc-800 last:border-b-0 hover:bg-zinc-800/50 transition">
                  <Link href={`/dashboard/forms/${form.id}`} className="flex items-center justify-between">
                    <span className="text-white font-medium">{form.title}</span>
                    <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
