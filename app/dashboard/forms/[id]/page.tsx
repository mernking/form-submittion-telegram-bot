import { db } from "@/lib/db";
import { forms, submissions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import FormActions from "../../form-actions";

export default async function ViewForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formId = id;

  const [form] = await db.select().from(forms).where(eq(forms.id, formId));
  if (!form) return notFound();

  const formSubmissions = await db
    .select()
    .from(submissions)
    .where(eq(submissions.formId, formId))
    .orderBy(desc(submissions.submittedAt));

  const questions = form.questions as any[];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard/forms" className="text-sm text-zinc-500 hover:text-zinc-300 transition">
            ← Back to Forms
          </Link>
        </div>

        {/* Form Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{form.title}</h1>
              <p className="mt-1 text-zinc-400">{form.description || "No description"}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`/submit/${form.id}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Public Link
              </a>
              <a
                href={`/api/forms/${form.id}/export`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </a>
              <FormActions formId={form.id} />
            </div>
          </div>
        </div>

        {/* Questions Overview */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl mb-8">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-white">Questions ({questions.length})</h2>
          </div>
          <ul className="divide-y divide-zinc-800">
            {questions.map((q, i) => (
              <li key={i} className="px-6 py-4 flex items-center justify-between">
                <span className="text-white">{q.text}</span>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">{q.type}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Submissions Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-white">Submissions ({formSubmissions.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Date</th>
                  {questions.map((q) => (
                    <th key={q.id} className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">
                      {q.text}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {formSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={questions.length + 1} className="px-6 py-10 text-center text-zinc-500">
                      No submissions yet
                    </td>
                  </tr>
                ) : (
                  formSubmissions.map((sub) => {
                    const answers = sub.answers as Record<string, string>;
                    return (
                      <tr key={sub.id} className="hover:bg-zinc-800/30 transition">
                        <td className="px-6 py-4 text-sm text-zinc-400 whitespace-nowrap">
                          {sub.submittedAt.toLocaleString()}
                        </td>
                        {questions.map((q) => (
                          <td key={q.id} className="px-6 py-4 text-sm text-white whitespace-nowrap">
                            {answers[q.id] || "-"}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
