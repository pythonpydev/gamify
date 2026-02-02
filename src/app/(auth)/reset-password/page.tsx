'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth/AuthForm';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/lib/store/authStore';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword, isLoading, error, clearError } = useAuthStore();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    // Check if user has a valid session (from password reset link)
    const checkSession = async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/forgot-password');
      } else {
        setHasSession(true);
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // Validation
    if (!password) {
      setLocalError('Password is required');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    const result = await updatePassword(password);

    if (!result.error) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  if (!hasSession) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center py-8">
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <AuthForm
        title="Password Updated"
        subtitle="Your password has been successfully reset"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="text-center py-4">
          <p className="text-neutral-300 mb-2">
            Your password has been updated successfully.
          </p>
          <p className="text-neutral-400 text-sm">
            Redirecting to login...
          </p>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Create New Password"
      subtitle="Enter your new password"
      onSubmit={handleSubmit}
      error={localError || error}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
            New Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            minLength={8}
          />
          <p className="text-xs text-neutral-400 mt-1">
            Must be at least 8 characters long
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-1">
            Confirm New Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </Button>
      </div>
    </AuthForm>
  );
}
