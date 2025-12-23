"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Question {
    id: string;
    text: string;
    type: "text" | "long_text";
}

export default function EditFormPage() {
    const params = useParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch(`/api/forms/${params.id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then((data) => {
                setTitle(data.form.title);
                setDescription(data.form.description || "");
                setQuestions(data.form.questions);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                alert("Error loading form");
                router.push("/dashboard");
            });
    }, [params.id, router]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Math.random().toString(36).substr(2, 9),
                text: "",
                type: "text",
            },
        ]);
    };

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter((q) => q.id !== id));
    };

    const updateQuestion = (id: string, field: keyof Question, value: string) => {
        setQuestions(
            questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`/api/forms/${params.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, questions }),
        });

        if (res.ok) {
            router.push("/dashboard");
        } else {
            alert("Failed to update form");
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
            <div className="mx-auto max-w-3xl bg-white dark:bg-zinc-900 rounded-lg shadow p-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Edit Form
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Form Title
                        </label>
                        <input
                            type="text"
                            required
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 sm:text-sm sm:leading-6"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Description (Optional)
                        </label>
                        <textarea
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 sm:text-sm sm:leading-6"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Questions
                            </h3>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                            >
                                + Add Question
                            </button>
                        </div>

                        {questions.map((q, index) => (
                            <div
                                key={q.id}
                                className="flex gap-4 items-start bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-md"
                            >
                                <div className="flex-1 space-y-4">
                                    <input
                                        type="text"
                                        required
                                        placeholder="Question Text"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 sm:text-sm sm:leading-6"
                                        value={q.text}
                                        onChange={(e) =>
                                            updateQuestion(q.id, "text", e.target.value)
                                        }
                                    />
                                    <select
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 sm:text-sm sm:leading-6"
                                        value={q.type}
                                        onChange={(e) =>
                                            updateQuestion(q.id, "type", e.target.value as any)
                                        }
                                    >
                                        <option value="text">Short Answer</option>
                                        <option value="long_text">Long Answer</option>
                                    </select>
                                </div>
                                {questions.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(q.id)}
                                        className="text-red-600 hover:text-red-500"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard")}
                            className="flex w-full justify-center rounded-md bg-white border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
