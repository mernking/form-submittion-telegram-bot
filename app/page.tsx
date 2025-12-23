import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text">
            Boundless Forms
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-sm text-zinc-400 hover:text-white transition">
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="animate-fade-in">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              ✨ Telegram-Powered Form Builder
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight animate-fade-in">
            Build Forms.{" "}
            <span className="gradient-text">Get Notified.</span>
            <br />
            Instantly.
          </h1>

          <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto animate-fade-in-delay-1">
            Create beautiful forms in seconds and receive instant notifications
            directly in your Telegram when someone submits. No more email checking.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-2">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-lg shadow-indigo-500/25 animate-pulse-glow"
            >
              Start Building for Free
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-zinc-300 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-xl transition"
            >
              See Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 border-t border-zinc-800/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything You Need
            </h2>
            <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
              A complete form solution with real-time notifications and powerful management tools.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 transition group">
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-indigo-500/10 text-indigo-400 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-indigo-400 transition">Form Builder</h3>
              <p className="text-zinc-400 text-sm">
                Create custom forms with drag-and-drop simplicity. Support for text, long text, and more.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 transition group">
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-purple-500/10 text-purple-400 rounded-xl">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-400 transition">Telegram Alerts</h3>
              <p className="text-zinc-400 text-sm">
                Get instant notifications in Telegram the moment someone submits your form.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 transition group">
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-pink-500/10 text-pink-400 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-pink-400 transition">Analytics</h3>
              <p className="text-zinc-400 text-sm">
                Track submissions with a beautiful dashboard. See totals, trends, and details at a glance.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 transition group">
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-green-500/10 text-green-400 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-green-400 transition">CSV Export</h3>
              <p className="text-zinc-400 text-sm">
                Download all your submissions as a CSV file with one click for easy analysis.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 transition group">
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-yellow-500/10 text-yellow-400 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-yellow-400 transition">Search & Filter</h3>
              <p className="text-zinc-400 text-sm">
                Quickly find forms with powerful search. Paginated lists keep things fast.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 transition group">
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-cyan-500/10 text-cyan-400 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-400 transition">Shareable Links</h3>
              <p className="text-zinc-400 text-sm">
                Each form gets a unique public link. Share it anywhere to collect responses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-zinc-800/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-zinc-400 mb-10 max-w-xl mx-auto">
            Join thousands of users collecting form submissions and getting instant Telegram notifications.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 text-lg font-semibold bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-lg shadow-indigo-500/25"
          >
            Create Your First Form →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-800/50">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Boundless Forms. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="#" className="hover:text-white transition">Privacy</Link>
            <Link href="#" className="hover:text-white transition">Terms</Link>
            <Link href="#" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
