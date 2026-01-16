'use client';

import { useEffect } from 'react';
import { useSessionStore } from '@/lib/store/sessionStore';

/**
 * Hook to protect against accidental session abandonment
 *
 * Adds a beforeunload handler when a session is active to warn users
 * before they close the tab or navigate away.
 */
export function useSessionGuard() {
  const activeSession = useSessionStore((state) => state.activeSession);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (activeSession && activeSession.status === 'ACTIVE') {
        // Standard way to trigger the browser's "leave page?" dialog
        event.preventDefault();
        // Some browsers require returnValue to be set
        event.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [activeSession]);

  return {
    hasActiveSession: activeSession?.status === 'ACTIVE',
  };
}
