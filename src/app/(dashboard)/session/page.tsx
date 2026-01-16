'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  TimerDisplay,
  SessionTypeSelector,
  CategorySelector,
  SessionCompletionModal,
  type Category,
} from '@/components/timer';
import { useTimer } from '@/lib/hooks/useTimer';
import { useSessionStore } from '@/lib/store/sessionStore';
import { SESSION_TYPES, type SessionTypeName } from '@/types/database';

// Default categories - will be replaced with API call
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'default-1', name: 'PhD', color: '#4F46E5', isDefault: true },
  { id: 'default-2', name: 'Math', color: '#059669', isDefault: true },
  { id: 'default-3', name: 'Programming', color: '#EA580C', isDefault: true },
  { id: 'default-4', name: 'Outschool Content', color: '#7C3AED', isDefault: true },
];

export default function SessionPage() {
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<SessionTypeName | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { activeSession, startSession, completeSession, clearSession } = useSessionStore();

  const handleTimerComplete = useCallback(() => {
    setShowCompletionModal(true);
  }, []);

  const timer = useTimer({
    onComplete: handleTimerComplete,
  });

  // Restore session on mount if one exists
  useEffect(() => {
    if (activeSession && activeSession.status === 'ACTIVE') {
      const startTime = new Date(activeSession.startTime).getTime();
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const duration = activeSession.durationMins * 60;
      const remaining = Math.max(0, duration - elapsed);

      if (remaining > 0) {
        setSelectedCategory(activeSession.categoryId);
        setSelectedType(activeSession.sessionType);
        timer.start(remaining);
      } else {
        // Timer already expired
        setShowCompletionModal(true);
      }
    }
  }, []);

  const handleStartSession = async () => {
    if (!selectedCategory || !selectedType) return;

    const category = categories.find((c) => c.id === selectedCategory);
    if (!category) return;

    const durationMins = SESSION_TYPES[selectedType].duration;

    // Start the session in store
    startSession({
      id: `local-${Date.now()}`, // Temporary ID until API creates real one
      categoryId: selectedCategory,
      categoryName: category.name,
      categoryColor: category.color,
      sessionType: selectedType,
      durationMins,
      startTime: new Date().toISOString(),
      status: 'ACTIVE',
    });

    // Start the timer
    timer.start(durationMins * 60);
  };

  const handleCompleteSession = async (qualityRating: number, _notes?: string) => {
    if (!activeSession) return;

    setIsSubmitting(true);

    try {
      // In a real app, this would call the API
      // For now, just update local state
      completeSession(qualityRating, 0);

      setShowCompletionModal(false);
      clearSession();
      timer.reset();

      // Navigate to dashboard or show success
      // router.push('/');
    } catch (error) {
      console.error('Failed to complete session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAbandonSession = () => {
    if (confirm('Are you sure you want to abandon this session? You won\'t earn any chips.')) {
      clearSession();
      timer.reset();
    }
  };

  const isSessionActive = timer.isRunning || timer.isPaused;
  const canStartSession = selectedCategory && selectedType && !isSessionActive;

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-felt-950 to-felt-900 py-8 px-4" data-testid="session-page">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Study Session
          </h1>
          <p className="text-felt-200">
            {isSessionActive
              ? `${selectedCategoryObj?.name || 'Session'} in progress`
              : 'Choose your session type and start studying'}
          </p>
        </div>

        {/* Timer Card */}
        <Card variant="elevated" padding="lg" className="mb-6">
          <TimerDisplay
            remainingSeconds={timer.remainingSeconds}
            totalSeconds={timer.totalSeconds}
            status={timer.status}
            className="mb-6"
          />

          {/* Timer Controls */}
          <div className="flex justify-center gap-3">
            {timer.isIdle && (
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartSession}
                disabled={!canStartSession}
              >
                Start Session
              </Button>
            )}

            {timer.isRunning && (
              <>
                <Button variant="outline" onClick={timer.pause}>
                  Pause
                </Button>
                <Button variant="danger" onClick={handleAbandonSession}>
                  Abandon
                </Button>
              </>
            )}

            {timer.isPaused && (
              <>
                <Button variant="primary" onClick={timer.resume}>
                  Resume
                </Button>
                <Button variant="danger" onClick={handleAbandonSession}>
                  Abandon
                </Button>
              </>
            )}

            {timer.isCompleted && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setShowCompletionModal(true)}
              >
                Rate & Claim Chips
              </Button>
            )}
          </div>
        </Card>

        {/* Session Setup (only when idle) */}
        {timer.isIdle && (
          <>
            <Card variant="default" padding="lg" className="mb-4">
              <SessionTypeSelector
                value={selectedType}
                onChange={setSelectedType}
                disabled={isSessionActive}
              />
            </Card>

            <Card variant="default" padding="lg">
              <CategorySelector
                categories={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                disabled={isSessionActive}
              />
            </Card>
          </>
        )}

        {/* Active Session Info */}
        {isSessionActive && selectedCategoryObj && (
          <Card variant="outlined" padding="md" className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedCategoryObj.color }}
              />
              <span>{selectedCategoryObj.name}</span>
              <span>•</span>
              <span>{selectedType && SESSION_TYPES[selectedType].label}</span>
            </div>
          </Card>
        )}
      </div>

      {/* Completion Modal */}
      <SessionCompletionModal
        isOpen={showCompletionModal}
        sessionType={selectedType ? SESSION_TYPES[selectedType].label : ''}
        categoryName={selectedCategoryObj?.name || ''}
        durationMins={selectedType ? SESSION_TYPES[selectedType].duration : 0}
        onComplete={handleCompleteSession}
        onClose={() => setShowCompletionModal(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
}
