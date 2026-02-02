'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/lib/store/authStore';

export default function ForgotPasswordPage() {
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(false);
    clearError();

    // Basic validation
    if (!email.trim()) {
      setLocalError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    const result = await resetPassword(email);

    if (!result.error) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <AuthForm
        title="Check Your Email"
        subtitle="We've sent you a password reset link"
        onSubmit={(e) => e.preventDefault()}
        footer={
          <Link
            href="/login"
            className="text-poker-gold hover:text-poker-gold/80 transition-colors"
          >
            Return to login
          </Link>
        }
      >
        <div className="text-center py-4">
          <p className="text-neutral-300 mb-4">
            If an account exists for <span className="font-semibold text-white">{email}</span>, 
            you will receive a password reset link shortly.
          </p>
          <p className="text-neutral-400 text-sm">
            Please check your email and click the link to reset your password.
          </p>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Reset Password"
      subtitle="Enter your email to receive a password reset link"
      onSubmit={handleSubmit}
      error={localError || error}
      isLoading={isLoading}
      footer={
        <Link
          href="/login"
          className="text-poker-gold hover:text-poker-gold/80 transition-colors"
        >
          Back to login
        </Link>
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

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </div>
    </AuthForm>
  );
}
