"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import FormActions from "../form-actions";

interface Form {
    id: string;
    title: string;
    description: string;
    questions: any[];
    isPublic: boolean;
    createdAt: string;
}

interface Metadata {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function FormsListPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";

    const [forms, setForms] = useState<Form[]>([]);
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(search);

    useEffect(() => {
        fetchForms(page, search);
    }, [page, search]);

    const fetchForms = async (p: number, s: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/forms?page=${p}&limit=9&search=${encodeURIComponent(s)}`);
            if (res.ok) {
                const data = await res.json();
                setForms(data.data);
                setMetadata(data.metadata);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/dashboard/forms?page=1&search=${encodeURIComponent(searchTerm)}`);
    };

    const handlePageChange = (newPage: number) => {
        router.push(`/dashboard/forms?page=${newPage}&search=${encodeURIComponent(search)}`);
    };

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-white">Forms</h1>
                    <Link
                        href="/dashboard/forms/create"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Form
                    </Link>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="Search forms..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </form>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-8 h-8 border-4 border-zinc-700 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                ) : forms.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-2xl">
                        <p className="text-zinc-500 mb-4">No forms found</p>
                        <Link
                            href="/dashboard/forms/create"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition text-sm font-medium"
                        >
                            Create Your First Form
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {forms.map((form) => (
                            <div
                                key={form.id}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition flex flex-col"
                            >
                                <div className="p-6 flex-1">
                                    <Link href={`/dashboard/forms/${form.id}`} className="group">
                                        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition truncate">
                                            {form.title}
                                        </h3>
                                    </Link>
                                    <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
                                        {form.description || "No description"}
                                    </p>
                                    <p className="mt-4 text-xs text-zinc-600">
                                        {new Date(form.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="px-6 py-4 border-t border-zinc-800 flex justify-between items-center">
                                    <Link
                                        href={`/dashboard/forms/${form.id}`}
                                        className="text-sm text-indigo-400 hover:text-indigo-300 transition"
                                    >
                                        View Details
                                    </Link>
                                    <FormActions formId={form.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {metadata && metadata.totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                        <button
                            onClick={() => handlePageChange(Math.max(1, page - 1))}
                            disabled={page <= 1}
                            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-zinc-500">
                            {metadata.page} / {metadata.totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(Math.min(metadata.totalPages, page + 1))}
                            disabled={page >= metadata.totalPages}
                            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
