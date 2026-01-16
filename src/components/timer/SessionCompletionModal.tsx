'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { QualityRating } from './QualityRating';
import { calculateChips } from '@/lib/utils/chips';

interface SessionCompletionModalProps {
  isOpen: boolean;
  sessionType: string;
  categoryName: string;
  durationMins: number;
  onComplete: (qualityRating: number, notes?: string) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function SessionCompletionModal({
  isOpen,
  sessionType,
  categoryName,
  durationMins,
  onComplete,
  onClose,
  isLoading = false,
}: SessionCompletionModalProps) {
  const [qualityRating, setQualityRating] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const chipPreview = qualityRating ? calculateChips(durationMins, qualityRating) : null;

  const handleSubmit = () => {
    if (qualityRating) {
      onComplete(qualityRating, notes || undefined);
    }
  };

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
            Session Complete!
          </h2>
          <p className="text-gray-600 mt-1">
            {sessionType} • {categoryName} • {durationMins} minutes
          </p>
        </div>

        {/* Quality rating */}
        <div className="mb-6">
          <QualityRating
            value={qualityRating}
            onChange={setQualityRating}
            disabled={isLoading}
          />
        </div>

        {/* Chip preview */}
        {chipPreview && (
          <div className="mb-6 p-4 bg-gradient-to-r from-chip-gold/10 to-chip-gold/5 rounded-xl border border-chip-gold/20">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Chips earned</p>
              <p className="text-3xl font-bold text-chip-gold animate-chip-bounce">
                +{chipPreview.totalChips}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {chipPreview.baseChips} base + {chipPreview.qualityBonus} quality bonus
              </p>
            </div>
          </div>
        )}

        {/* Notes (optional) */}
        <div className="mb-6">
          <label htmlFor="session-notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            id="session-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you study? Any reflections?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-felt-500 focus:border-felt-500 resize-none"
            rows={3}
            maxLength={500}
            disabled={isLoading}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleSubmit}
            disabled={!qualityRating || isLoading}
            isLoading={isLoading}
            className="flex-1"
          >
            Claim Chips
          </Button>
        </div>
      </Card>
    </div>
  );
}
