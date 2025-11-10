'use client';

import { useHostAccess } from '@/hooks/useHostAccess';

export interface HostLinkProps {
  sessionId: string | undefined;
}

/**
 * HostLink
 * Conditional indicator that shows if user is the host
 * Note: Host management page has been removed in the simplified flow
 */
export function HostLink({ sessionId }: HostLinkProps) {
  const { isHost, isLoading } = useHostAccess(sessionId);

  // Don't render if not host, still loading, or no sessionId
  if (!isHost || isLoading || !sessionId) {
    return null;
  }

  // Host management removed - just show a badge indicating host status
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
      <span className="mr-1">👑</span>
      ホスト
    </div>
  );
}
