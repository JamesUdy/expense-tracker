import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/use-auth';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import type { AuthFormState } from '../types/auth';

interface AuthFormProps {
  onAuth: () => void;
}

const INITIAL: AuthFormState = { email: '', password: '' };
const DEMO_CREDENTIALS = { email: 'demo@example.com', password: 'demo1234' };

export function AuthForm({ onAuth }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState<AuthFormState>(INITIAL);
  const [isPending, setIsPending] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const { login, register } = useAuth();

  function handleChange(field: keyof AuthFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        await register(form.email, form.password);
        toast.success('Account created!');
      }
      onAuth();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsPending(false);
    }
  }

  async function handleDemo() {
    setIsDemoLoading(true);
    try {
      await login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
      toast.success('Signed in as demo account');
      onAuth();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Demo login failed.');
    } finally {
      setIsDemoLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--color-background) px-4">
      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-bold text-(--color-foreground)">💸 Expense Tracker</h1>
        <p className="mb-6 text-sm text-(--color-muted-foreground)">
          {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder={mode === 'register' ? 'Min 8 characters' : '••••••••'}
            required
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
          <Button type="submit" loading={isPending} className="mt-1 w-full">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <hr className="flex-1 border-(--color-border)" />
          <span className="text-xs text-(--color-muted-foreground)">or</span>
          <hr className="flex-1 border-(--color-border)" />
        </div>

        <Button
          type="button"
          variant="secondary"
          loading={isDemoLoading}
          onClick={handleDemo}
          className="w-full"
        >
          Try demo account
        </Button>

        <p className="mt-4 text-center text-sm text-(--color-muted-foreground)">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setForm(INITIAL); }}
            className="font-medium text-(--color-primary) hover:underline"
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </Card>
    </div>
  );
}
