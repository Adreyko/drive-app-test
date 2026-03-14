import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 md:px-8 md:py-10">
      <section className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="neo-card bg-lemon p-7 md:p-8">
          <div className="max-w-3xl space-y-4">
            <span className="neo-badge bg-white">Drive App</span>
            <h1 className="font-display text-3xl leading-tight text-ink md:text-5xl">
              Store. Share. Work.
            </h1>
            <p className="max-w-2xl text-base text-ink md:text-lg">
              A clean file workspace for uploading, organizing, sharing, and opening files without leaving the app.
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link className="neo-button bg-white" href="/register">
                Create account
              </Link>
              <Link className="neo-button bg-mint" href="/login">
                Log in
              </Link>
            </div>
          </div>
        </article>

        <article className="neo-card bg-white p-5 md:p-6">
          <p className="text-xs font-semibold tracking-[0.08em] text-ink">
            What you can do
          </p>
          <div className="mt-6 space-y-4">
            <article className="neo-card bg-mint p-4">
              <p className="text-sm font-bold text-ink">
                Create folders and keep files organized.
              </p>
            </article>
            <article className="neo-card bg-sky p-4">
              <p className="text-sm font-bold text-ink">
                Share files with viewer or editor access.
              </p>
            </article>
            <article className="neo-card bg-mint p-4">
              <p className="text-sm font-bold text-ink">
                Mark files visible for every signed-in user when needed.
              </p>
            </article>
            <article className="neo-card bg-sky p-4">
              <p className="text-sm font-bold text-ink">
                See updates quickly across users.
              </p>
            </article>
          </div>
        </article>
      </section>
    </main>
  );
}
