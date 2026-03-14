import Link from 'next/link';

type AuthFormShellProps = Readonly<{
  badge: string;
  title: string;
  description: string;
  accentClassName: string;
  children: React.ReactNode;
  alternateAction: React.ReactNode;
}>;

const promiseList = [
  'JWT-backed login flow',
  'Protected dashboard route',
  'Ready for folders in Phase 3',
];

export function AuthFormShell({
  badge,
  title,
  description,
  accentClassName,
  children,
  alternateAction,
}: AuthFormShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 md:px-8 md:py-10">
      <section className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className={`neo-card p-8 ${accentClassName}`}>
          <div className="flex h-full flex-col justify-between gap-8">
            <div className="space-y-5">
              <span className="neo-badge bg-white">{badge}</span>
              <div className="space-y-4">
                <h1 className="font-display text-4xl uppercase leading-none md:text-6xl">
                  {title}
                </h1>
                <p className="max-w-xl text-lg font-bold text-ink">
                  {description}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {promiseList.map((item) => (
                <article key={item} className="neo-card bg-white p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-ink">
                    MVP promise
                  </p>
                  <p className="mt-3 text-sm font-bold text-ink">{item}</p>
                </article>
              ))}
            </div>

            <Link className="text-sm font-black uppercase tracking-[0.14em]" href="/">
              Back to home
            </Link>
          </div>
        </div>

        <div className="neo-card bg-white p-6 md:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-ink">
                Secure Access
              </p>
              <p className="mt-2 max-w-sm text-sm font-bold text-ink/80">
                Use your email and password to enter the Drive MVP. Folder and
                file management starts in the next phase.
              </p>
            </div>
            <div className="neo-badge bg-mint">Auth Live</div>
          </div>

          {children}

          <div className="mt-6 border-t-4 border-black pt-6">{alternateAction}</div>
        </div>
      </section>
    </main>
  );
}
