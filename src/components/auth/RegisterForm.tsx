'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthForm } from './AuthForm';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/lib/store/authStore';

export function RegisterForm() {
  const { register, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // Basic validation
    if (!email.trim()) {
      setLocalError('Email is required');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setLocalError('Password is required');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    const result = await register(email, password);

    if (!result.error) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <AuthForm
        title="Check Your Email"
        subtitle="We've sent you a confirmation link"
        onSubmit={(e) => e.preventDefault()}
        footer={
          <p className="text-neutral-400">
            Already confirmed?{' '}
            <Link
              href="/login"
              className="text-poker-gold hover:text-poker-gold/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        }
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-neutral-300">
            Please check your email at <strong className="text-white">{email}</strong> and click the confirmation link to activate your account.
          </p>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Create Account"
      subtitle="Start earning chips for your study sessions"
      onSubmit={handleSubmit}
      error={localError || error}
      isLoading={isLoading}
      footer={
        <p className="text-neutral-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-poker-gold hover:text-poker-gold/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />
          <p className="mt-1 text-xs text-neutral-500">At least 8 characters</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-1">
            Confirm Password
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
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </div>
    </AuthForm>
  );
}
