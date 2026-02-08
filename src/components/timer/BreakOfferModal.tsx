'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface BreakOfferModalProps {
  isOpen: boolean;
  sessionType: string;
  categoryName: string;
  durationMins: number;
  breakDurationMins: number;
  onTakeBreak: () => void;
  onSkipBreak: () => void;
  onClose: () => void;
}

export function BreakOfferModal({
  isOpen,
  sessionType,
  categoryName,
  durationMins,
  breakDurationMins,
  onTakeBreak,
  onSkipBreak,
  onClose,
}: BreakOfferModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <Card
        variant="elevated"
        padding="lg"
        className="relative w-full max-w-md animate-in fade-in zoom-in duration-200"
      >
        {/* Celebration header */}
        <div className="text-center mb-6">
          <span className="text-6xl mb-4 block">🎉</span>
          <h2 className="text-2xl font-display font-bold text-gray-900">
            Work Session Complete!
          </h2>
          <p className="text-gray-600 mt-1">
            {sessionType} • {categoryName} • {durationMins} minutes
          </p>
        </div>

        {/* Break offer */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
          <div className="text-center">
            <span className="text-3xl mb-2 block">☕</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Time for a Break?
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Take a {breakDurationMins}-minute break to recharge, then start another session automatically.
            </p>
            <div className="flex flex-col gap-2 text-xs text-gray-500">
              <span>💡 Breaks help maintain focus and prevent burnout</span>
              <span>🔄 After the break, you can start a new session</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={onTakeBreak}
            className="w-full"
          >
            Take {breakDurationMins}-Minute Break
          </Button>
          <Button
            variant="outline"
            onClick={onSkipBreak}
            className="w-full"
          >
            Skip Break & Finish Session
          </Button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </Card>
    </div>
  );
}