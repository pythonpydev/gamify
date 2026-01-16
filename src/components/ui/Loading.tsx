'use client';

import { cn } from '@/lib/utils/cn';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function Loading({ size = 'md', text, className }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'rounded-full border-poker-gold border-t-transparent animate-spin',
          sizeClasses[size]
        )}
      />
      {text && <p className="text-neutral-400 text-sm">{text}</p>}
    </div>
  );
}

export interface LoadingPageProps {
  icon?: string;
  text?: string;
}

export function LoadingPage({ icon = '🎰', text = 'Loading...' }: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-poker-felt-dark flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse">{icon}</div>
        <Loading size="md" text={text} />
      </div>
    </div>
  );
}

export interface LoadingOverlayProps {
  text?: string;
}

export function LoadingOverlay({ text = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-neutral-900 rounded-xl p-8 shadow-xl">
        <Loading size="lg" text={text} />
      </div>
    </div>
  );
}
