'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
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
import { initAudioContext, testAlarm } from '@/lib/utils/alarm';

export default function SessionPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<SessionTypeName | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alarmEnabled, setAlarmEnabled] = useState(true);

  const { activeSession, startSession, completeSession, clearSession } = useSessionStore();

  const handleTimerComplete = useCallback(() => {
    setShowCompletionModal(true);
  }, []);

  const timer = useTimer({
    onComplete: handleTimerComplete,
    playAlarmOnComplete: alarmEnabled,
  });

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

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

    const sessionConfig = SESSION_TYPES[selectedType];
    // Handle TEST_HAND which uses durationSeconds instead of duration
    const durationSeconds = 'durationSeconds' in sessionConfig 
      ? sessionConfig.durationSeconds 
      : sessionConfig.duration * 60;
    const durationMins = Math.ceil(durationSeconds / 60);

    try {
      // Create session via API
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          categoryId: selectedCategory,
          sessionType: selectedType,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Failed to create session:', errorData);
        alert(errorData.error?.message || 'Failed to start session');
        return;
      }

      const session = await res.json();

      // Start the session in store with the real ID from the API
      startSession({
        id: session.id,
        categoryId: selectedCategory,
        categoryName: category.name,
        categoryColor: category.color,
        sessionType: selectedType,
        durationMins,
        startTime: new Date().toISOString(),
        status: 'ACTIVE',
      });

      // Start the timer
      timer.start(durationSeconds);
    } catch (error) {
      console.error('Failed to start session:', error);
      alert('Failed to start session. Please try again.');
    }
  };

  const handleCompleteSession = async (qualityRating: number, notes?: string) => {
    if (!activeSession) return;

    setIsSubmitting(true);

    try {
      // Complete session via API
      const res = await fetch(`/api/sessions/${activeSession.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          status: 'COMPLETED',
          qualityRating,
          notes,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Failed to complete session:', errorData);
        alert(errorData.error?.message || 'Failed to complete session');
        return;
      }

      const data = await res.json();
      
      // Update local state with chips earned
      completeSession(qualityRating, data.chipsEarned || 0);

      setShowCompletionModal(false);
      clearSession();
      timer.reset();

      // Show success message with chips earned
      if (data.chipsEarned > 0) {
        alert(`Session completed! You earned ${data.chipsEarned} chips! 🎰`);
      }
    } catch (error) {
      console.error('Failed to complete session:', error);
      alert('Failed to complete session. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAbandonSession = async () => {
    if (!confirm('Are you sure you want to abandon this session? You won\'t earn any chips.')) {
      return;
    }

    if (activeSession) {
      try {
        // Abandon session via API
        await fetch(`/api/sessions/${activeSession.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            status: 'ABANDONED',
          }),
        });
      } catch (error) {
        console.error('Failed to abandon session:', error);
      }
    }

    clearSession();
    timer.reset();
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
              <div className="space-y-4">
                <SessionTypeSelector
                  value={selectedType}
                  onChange={setSelectedType}
                  disabled={isSessionActive}
                />
                
                {/* Alarm Toggle */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-700">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔔</span>
                    <div>
                      <div className="text-sm font-medium text-white">Sound Alarm</div>
                      <div className="text-xs text-neutral-400">Play audio when timer completes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Toggle
                      enabled={alarmEnabled}
                      onChange={(enabled) => {
                        setAlarmEnabled(enabled);
                        // Initialize audio context on first interaction
                        if (enabled) {
                          initAudioContext();
                        }
                      }}
                    />
                    {alarmEnabled && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          testAlarm();
                        }}
                        className="text-xs text-poker-gold hover:text-poker-gold/80 underline"
                      >
                        Test
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="default" padding="lg">
              {isLoadingCategories ? (
                <div className="text-center py-4">
                  <p className="text-neutral-400">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-neutral-400 mb-2">No categories found</p>
                  <a href="/categories" className="text-poker-gold hover:underline">
                    Create a category first
                  </a>
                </div>
              ) : (
                <CategorySelector
                  categories={categories}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  disabled={isSessionActive}
                />
              )}
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
