import { LoginForm } from '@/components/features/auth/login-form';

type LoginPageProps = {
  searchParams?: {
    redirect?: string | string[];
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirectValue = searchParams?.redirect;
  const redirectTo =
    typeof redirectValue === 'string' ? redirectValue : '/dashboard';

  return <LoginForm redirectTo={redirectTo} />;
}
