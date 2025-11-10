import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFound from '@/app/not-found';

describe('NotFound', () => {
  describe('Rendering', () => {
    it('should render 404 heading', () => {
      render(<NotFound />);

      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should render error message in Japanese', () => {
      render(<NotFound />);

      expect(screen.getByText('ページが見つかりません')).toBeInTheDocument();
      expect(
        screen.getByText(
          'お探しのページは存在しないか、移動または削除された可能性があります。',
        ),
      ).toBeInTheDocument();
    });

    it('should render link to join page', () => {
      render(<NotFound />);

      const link = screen.getByRole('link', { name: /ゲーム参加ページへ/ });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/join');
    });
  });

  describe('Styling', () => {
    it('should apply correct styling classes to link', () => {
      render(<NotFound />);

      const link = screen.getByRole('link', { name: /ゲーム参加ページへ/ });
      expect(link).toHaveClass('bg-blue-600');
      expect(link).toHaveClass('text-white');
      expect(link).toHaveClass('rounded-lg');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const { container } = render(<NotFound />);

      const h1 = container.querySelector('h1');
      const h2 = container.querySelector('h2');

      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent('404');
      expect(h2).toBeInTheDocument();
      expect(h2).toHaveTextContent('ページが見つかりません');
    });

    it('should have accessible link', () => {
      render(<NotFound />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAccessibleName('ゲーム参加ページへ');
    });
  });
});
