import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { HostLink } from '@/components/domain/host/HostLink';

// Mock useHostAccess hook
const mockUseHostAccess = vi.fn();
vi.mock('@/hooks/useHostAccess', () => ({
  useHostAccess: (sessionId: string | undefined) => mockUseHostAccess(sessionId),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('HostLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render badge when user is host', () => {
      mockUseHostAccess.mockReturnValue({
        isHost: true,
        isLoading: false,
        error: null,
      });

      render(<HostLink sessionId="TEST42" />);

      expect(screen.getByText(/ホスト/)).toBeInTheDocument();
      expect(screen.getByText(/👑/)).toBeInTheDocument();
    });

    it('should not render when user is not host', () => {
      mockUseHostAccess.mockReturnValue({
        isHost: false,
        isLoading: false,
        error: null,
      });

      render(<HostLink sessionId="TEST42" />);

      expect(screen.queryByText(/ホスト/)).not.toBeInTheDocument();
      expect(screen.queryByText(/👑/)).not.toBeInTheDocument();
    });

    it('should not render while loading', () => {
      mockUseHostAccess.mockReturnValue({
        isHost: false,
        isLoading: true,
        error: null,
      });

      render(<HostLink sessionId="TEST42" />);

      expect(screen.queryByText(/ホスト/)).not.toBeInTheDocument();
    });

    it('should not render when there is an error', () => {
      mockUseHostAccess.mockReturnValue({
        isHost: false,
        isLoading: false,
        error: 'Failed to check host access',
      });

      render(<HostLink sessionId="TEST42" />);

      expect(screen.queryByText(/ホスト/)).not.toBeInTheDocument();
    });

    it('should not render when sessionId is undefined', () => {
      mockUseHostAccess.mockReturnValue({
        isHost: false,
        isLoading: false,
        error: null,
      });

      render(<HostLink sessionId={undefined} />);

      expect(screen.queryByText(/ホスト/)).not.toBeInTheDocument();
      expect(mockUseHostAccess).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Badge Properties', () => {
    it('should display host badge with correct styling', () => {
      mockUseHostAccess.mockReturnValue({
        isHost: true,
        isLoading: false,
        error: null,
      });

      const { container } = render(<HostLink sessionId="TEST42" />);

      const badge = container.querySelector('.inline-flex');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('inline-flex');
      expect(badge).toHaveClass('bg-blue-100');
      expect(badge).toHaveClass('text-blue-800');
    });
  });

  describe('Hook Integration', () => {
    it('should call useHostAccess with correct sessionId', () => {
      mockUseHostAccess.mockReturnValue({
        isHost: true,
        isLoading: false,
        error: null,
      });

      render(<HostLink sessionId="ABC123" />);

      expect(mockUseHostAccess).toHaveBeenCalledWith('ABC123');
    });

    it('should react to hook state changes', () => {
      const { rerender } = render(<HostLink sessionId="TEST42" />);

      // Initially not host
      mockUseHostAccess.mockReturnValue({
        isHost: false,
        isLoading: false,
        error: null,
      });

      rerender(<HostLink sessionId="TEST42" />);
      expect(screen.queryByText(/ホスト/)).not.toBeInTheDocument();

      // Becomes host
      mockUseHostAccess.mockReturnValue({
        isHost: true,
        isLoading: false,
        error: null,
      });

      rerender(<HostLink sessionId="TEST42" />);
      expect(screen.getByText(/ホスト/)).toBeInTheDocument();
    });
  });

  describe('Different Session IDs', () => {
    it('should render badge for different sessionIds', () => {
      const sessionIds = ['TEST42', 'ABC123', 'XYZ789'];

      sessionIds.forEach((sessionId) => {
        mockUseHostAccess.mockReturnValue({
          isHost: true,
          isLoading: false,
          error: null,
        });

        const { unmount } = render(<HostLink sessionId={sessionId} />);

        expect(screen.getByText(/ホスト/)).toBeInTheDocument();
        expect(screen.getByText(/👑/)).toBeInTheDocument();

        unmount();
      });
    });
  });
});
