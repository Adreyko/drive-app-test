import Link from 'next/link';
import { HealthPanel } from '@/components/health-panel';

const phaseGoals = [
  'Register with email + password',
  'Log in with JWT authentication',
  'Persist the session token in the frontend',
  'Protect the dashboard route',
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
      <section className="neo-card bg-lemon p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="neo-badge bg-white">Phase 2 / Authentication</span>
            <h1 className="font-display text-4xl uppercase leading-none text-ink md:text-6xl">
              Store. Share. Sync.
            </h1>
            <p className="max-w-2xl text-lg text-ink">
              The Drive MVP now has the first real user flow: register, log in,
              keep a JWT session, and enter a protected dashboard shell that is
              ready for folders and files in the next phases.
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link className="neo-button bg-white" href="/register">
                Create account
              </Link>
              <Link className="neo-button bg-mint" href="/login">
                Log in
              </Link>
              <Link className="neo-button bg-sky" href="/dashboard">
                Open dashboard
              </Link>
            </div>
          </div>

          <div className="neo-card max-w-sm bg-white p-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-ink">
              Phase goals
            </p>
            <ul className="mt-4 space-y-3">
              {phaseGoals.map((goal) => (
                <li key={goal} className="flex items-start gap-3 text-sm font-bold">
                  <span className="mt-1 h-3 w-3 rounded-full border-2 border-black bg-mint" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <HealthPanel />

        <div className="neo-card bg-sky p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-ink">
                Architecture Snapshot
              </p>
              <h2 className="mt-2 font-display text-3xl uppercase text-ink">
                Ready For Phase 3
              </h2>
            </div>
            <div className="hidden rounded-full border-4 border-black bg-white px-4 py-2 text-sm font-black uppercase md:block">
              MVP Track
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="neo-card bg-white p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-ink">
                Backend
              </p>
              <p className="mt-3 text-sm font-bold text-ink">
                The API now owns users, password hashing, JWT issuing, and a
                protected `GET /auth/me` endpoint for the current session.
              </p>
            </article>

            <article className="neo-card bg-white p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-ink">
                Frontend
              </p>
              <p className="mt-3 text-sm font-bold text-ink">
                The frontend now has dedicated auth pages, a feature-based API
                layer, token storage, route protection, and an authenticated
                dashboard shell.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
