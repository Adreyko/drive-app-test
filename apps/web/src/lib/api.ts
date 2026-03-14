export type HealthStatus = {
  service: string;
  status: string;
  database: string;
  timestamp: string;
};

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

export async function getHealthStatus(): Promise<HealthStatus> {
  const response = await fetch(`${apiBaseUrl}/health`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Could not reach the backend health endpoint.');
  }

  return (await response.json()) as HealthStatus;
}
