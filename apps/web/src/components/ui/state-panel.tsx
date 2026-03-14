import { cn } from '@/lib/utils';

type StatePanelTone = 'white' | 'sky' | 'blush' | 'mint' | 'lemon';

type StatePanelProps = Readonly<{
  action?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  description: React.ReactNode;
  eyebrow: string;
  title: React.ReactNode;
  tone?: StatePanelTone;
}>;

const toneClassNames: Record<StatePanelTone, string> = {
  white: 'bg-white',
  sky: 'bg-sky',
  blush: 'bg-blush',
  mint: 'bg-mint',
  lemon: 'bg-lemon',
};

export function StatePanel({
  action,
  badge,
  className,
  description,
  eyebrow,
  title,
  tone = 'white',
}: StatePanelProps) {
  return (
    <section className={cn('neo-state-panel p-5', toneClassNames[tone], className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-display text-2xl leading-tight text-ink md:text-3xl">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-medium text-ink/80">
            {description}
          </p>
        </div>

        {badge ? <div className="neo-badge bg-white">{badge}</div> : null}
      </div>

      {action ? <div className="mt-6 flex flex-wrap gap-3">{action}</div> : null}
    </section>
  );
}
