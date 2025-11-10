import { useRouter } from 'next/navigation';
import { useState } from 'react';

export interface UseJoinPageProps {
  sessionId?: string;
}

/**
 * useJoinPage
 * Custom hook for join page logic
 */
export function useJoinPage({ sessionId }: UseJoinPageProps) {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [joinSessionId, setJoinSessionId] = useState(sessionId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // If sessionId is provided via query param, default to 'join' mode
  const [mode, setMode] = useState<'join' | 'create'>(sessionId ? 'join' : 'create');

  /**
   * Handle navigation to create page
   * Simplified flow: Navigate to /create instead of creating session directly
   */
  const handleCreateSession = async () => {
    // Navigate to create page
    router.push('/create');
  };

  /**
   * Handle joining a session
   * Simplified flow: Stay on join page after joining
   */
  const handleJoinSession = async () => {
    if (!nickname.trim()) {
      setError('ニックネームを入力してください');
      return;
    }

    if (!joinSessionId.trim()) {
      setError('セッションIDを入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${joinSessionId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'セッションへの参加に失敗しました');
      }

      // const data = await response.json();
      // Simplified flow: Stay on join page (no game play page to navigate to)
      // In the future, this could show a success message or update the UI
      setError(null);
      // Success! User has joined the session
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  return {
    nickname,
    setNickname,
    joinSessionId,
    setJoinSessionId,
    isLoading,
    error,
    mode,
    setMode,
    handleCreateSession,
    handleJoinSession,
    clearError,
  };
}
