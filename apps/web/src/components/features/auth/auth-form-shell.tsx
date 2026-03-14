import Link from 'next/link';

type AuthFormShellProps = Readonly<{
  badge: string;
  title: string;
  description: string;
  accentClassName: string;
  children: React.ReactNode;
  alternateAction: React.ReactNode;
}>;

export function AuthFormShell({
  badge,
  title,
  description,
  accentClassName,
  children,
  alternateAction,
}: AuthFormShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-8 md:px-8 md:py-10">
      <section className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className={`neo-card p-7 md:p-8 ${accentClassName}`}>
          <div className="flex h-full flex-col justify-between gap-10">
            <div className="space-y-5">
              <span className="neo-badge bg-white">Drive</span>
              <div className="space-y-4">
                <h1 className="font-display text-3xl leading-tight md:text-5xl">
                  {title}
                </h1>
                <p className="max-w-xl text-base font-medium text-ink md:text-lg">
                  {description}
                </p>
              </div>
            </div>

            <div className="neo-card bg-white p-5">
              <p className="text-xs font-semibold tracking-[0.08em] text-ink">
                {badge}
              </p>
              <p className="mt-3 text-sm font-medium text-ink">
                Use your email and password to open your file workspace.
              </p>
            </div>

            <Link className="text-sm font-semibold tracking-[0.04em]" href="/">
              Back home
            </Link>
          </div>
        </div>

        <div className="neo-card bg-white p-5 md:p-6">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-[0.08em] text-ink">
              Account access
            </p>
          </div>

          {children}

          <div className="mt-6 border-t-2 border-black pt-6">{alternateAction}</div>
        </div>
      </section>
    </main>
  );
}
