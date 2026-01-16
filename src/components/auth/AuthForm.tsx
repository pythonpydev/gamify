'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/ui/Card';

export interface AuthFormProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string | null;
  isLoading?: boolean;
  footer?: ReactNode;
  className?: string;
}

export function AuthForm({
  children,
  title,
  subtitle,
  onSubmit,
  error,
  isLoading,
  footer,
  className,
}: AuthFormProps) {
  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <Card className="p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          {subtitle && (
            <p className="text-neutral-400">{subtitle}</p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <fieldset disabled={isLoading} className="space-y-4">
            {children}
          </fieldset>
        </form>

        {footer && (
          <div className="mt-6 pt-6 border-t border-neutral-700 text-center">
            {footer}
          </div>
        )}
      </Card>
    </div>
  );
}
