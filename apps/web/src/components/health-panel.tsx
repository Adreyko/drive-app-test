'use client';

import { useQuery } from '@tanstack/react-query';
import { getHealthStatus } from '@/lib/api';

export function HealthPanel() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['health'],
    queryFn: getHealthStatus,
    refetchInterval: 15000,
    retry: 1,
  });

  return (
    <section className="neo-card bg-blush p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-ink">
            Live Health Probe
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase text-ink">
            Backend Handshake
          </h2>
        </div>
        <div className="neo-badge bg-white">
          {isLoading ? 'Checking' : isError ? 'Offline' : 'Online'}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="neo-card bg-white p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-ink">
            API Status
          </p>
          <p className="mt-4 text-3xl font-display uppercase text-ink">
            {isLoading ? 'Loading' : isError ? 'Unavailable' : data?.status}
          </p>
          <p className="mt-2 text-sm font-bold text-ink">
            {isError
              ? error.message
              : 'The frontend is polling the Nest API and ready for future dashboard queries.'}
          </p>
        </article>

        <article className="neo-card bg-mint p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-ink">
            Database
          </p>
          <p className="mt-4 text-3xl font-display uppercase text-ink">
            {isLoading ? 'Pending' : isError ? 'Unknown' : data?.database}
          </p>
          <p className="mt-2 text-sm font-bold text-ink">
            {data
              ? `Last verified ${new Date(data.timestamp).toLocaleString()}.`
              : 'Start Postgres and the API to validate the connection.'}
          </p>
        </article>
      </div>
    </section>
  );
}
