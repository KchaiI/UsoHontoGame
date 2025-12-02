// Component Tests: Button
// UI Primitive component for consistent button styling

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('should render button element', () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should render children text', () => {
      render(<Button>Click me</Button>);

      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render children with JSX', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );

      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('should have default type="button"', () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Variants', () => {
    it('should apply primary variant by default', () => {
      render(<Button>Primary</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600', 'text-white', 'hover:bg-blue-700');
    });

    it('should apply primary variant styles', () => {
      render(<Button variant="primary">Primary</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'bg-blue-600',
        'text-white',
        'hover:bg-blue-700',
        'focus:ring-blue-500'
      );
    });

    it('should apply secondary variant styles', () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'bg-gray-200',
        'text-gray-900',
        'hover:bg-gray-300',
        'focus:ring-gray-500'
      );
    });

    it('should not have primary styles when secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('bg-blue-600');
    });
  });

  describe('Sizes', () => {
    it('should apply medium size by default', () => {
      render(<Button>Medium</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-base');
    });

    it('should apply small size styles', () => {
      render(<Button size="sm">Small</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('should apply medium size styles', () => {
      render(<Button size="md">Medium</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-base');
    });

    it('should apply large size styles', () => {
      render(<Button size="lg">Large</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });

    it('should not have other size styles when specific size applied', () => {
      render(<Button size="sm">Small</Button>);

      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('px-4', 'py-2');
      expect(button).not.toHaveClass('px-6', 'py-3');
    });
  });

  describe('Base Styles', () => {
    it('should apply base styles to all buttons', () => {
      render(<Button>Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'btn-base',
        'inline-flex',
        'items-center',
        'justify-center',
        'font-medium',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2'
      );
    });

    it('should apply disabled styles', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should not be disabled by default', () => {
      render(<Button>Enabled</Button>);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('should apply disabled hover styles for primary variant', () => {
      render(
        <Button variant="primary" disabled>
          Disabled Primary
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:hover:bg-blue-600');
    });

    it('should apply disabled hover styles for secondary variant', () => {
      render(
        <Button variant="secondary" disabled>
          Disabled Secondary
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:hover:bg-gray-200');
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Custom className', () => {
    it('should merge custom className with base styles', () => {
      render(<Button className="custom-class">Custom</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('rounded-lg'); // Base style still applied
    });

    it('should apply multiple custom classes', () => {
      render(<Button className="class-1 class-2 class-3">Multiple Classes</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('class-1', 'class-2', 'class-3');
    });

    it('should handle empty className', () => {
      render(<Button className="">No Custom Class</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-lg'); // Base styles still applied
    });
  });

  describe('Button Attributes', () => {
    it('should accept and apply type attribute', () => {
      render(<Button type="submit">Submit</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should accept and apply aria-label', () => {
      render(<Button aria-label="Close dialog">X</Button>);

      const button = screen.getByRole('button', { name: 'Close dialog' });
      expect(button).toBeInTheDocument();
    });

    it('should accept and apply data attributes', () => {
      render(<Button data-testid="custom-button">Test</Button>);

      const button = screen.getByTestId('custom-button');
      expect(button).toBeInTheDocument();
    });

    it('should accept and apply id attribute', () => {
      render(<Button id="my-button">ID Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'my-button');
    });

    it('should accept and apply name attribute', () => {
      render(<Button name="submit-button">Named Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('name', 'submit-button');
    });

    it('should accept and apply value attribute', () => {
      render(<Button value="button-value">Value Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('value', 'button-value');
    });
  });

  describe('Click Handling', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should pass event to onClick handler', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should handle multiple clicks', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('should work without onClick handler', () => {
      render(<Button>No Handler</Button>);

      const button = screen.getByRole('button');
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe('Variant and Size Combinations', () => {
    it('should combine primary variant with small size', () => {
      render(
        <Button variant="primary" size="sm">
          Primary Small
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600'); // Primary variant
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm'); // Small size
    });

    it('should combine secondary variant with large size', () => {
      render(
        <Button variant="secondary" size="lg">
          Secondary Large
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-200'); // Secondary variant
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg'); // Large size
    });

    it('should combine variant, size, and custom className', () => {
      render(
        <Button variant="secondary" size="sm" className="custom-class">
          All Props
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-200'); // Secondary variant
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm'); // Small size
      expect(button).toHaveClass('custom-class'); // Custom class
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Keyboard Button</Button>);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should have focus ring styles', () => {
      render(<Button>Focus Test</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2');
    });

    it('should have proper focus ring color for primary variant', () => {
      render(<Button variant="primary">Primary Focus</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:ring-blue-500');
    });

    it('should have proper focus ring color for secondary variant', () => {
      render(<Button variant="secondary">Secondary Focus</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:ring-gray-500');
    });

    it('should support aria-disabled', () => {
      render(<Button aria-disabled="true">Aria Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children gracefully', () => {
      render(<Button>{''}</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should handle number as children', () => {
      render(<Button>{123}</Button>);

      expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('should handle boolean disabled prop explicitly', () => {
      render(<Button disabled={true}>Explicitly Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should not be disabled when disabled={false}', () => {
      render(<Button disabled={false}>Not Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('should handle undefined variant (uses default)', () => {
      render(<Button variant={undefined}>Undefined Variant</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600'); // Default primary
    });

    it('should handle undefined size (uses default)', () => {
      render(<Button size={undefined}>Undefined Size</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-base'); // Default medium
    });
  });

  describe('New Variants (Feature: 009-apple-hig-ui-redesign)', () => {
    it('should render tertiary variant', () => {
      render(<Button variant="tertiary">Tertiary</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-tertiary', 'bg-transparent', 'text-blue-600', 'border');
    });

    it('should render destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-destructive', 'bg-red-600', 'text-white');
    });

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-ghost', 'bg-transparent', 'text-gray-700');
    });
  });

  describe('Loading State (Feature: 009-apple-hig-ui-redesign)', () => {
    it('should show loading spinner when loading', () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-loading');
      expect(button.querySelector('.btn-spinner')).toBeInTheDocument();
    });

    it('should be disabled when loading', () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should have aria-busy when loading', () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('should not call onClick when loading', () => {
      const handleClick = vi.fn();
      render(
        <Button loading onClick={handleClick}>
          Loading
        </Button>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should keep showing text by default when loading', () => {
      render(<Button loading>Submit</Button>);

      expect(screen.getByText('Submit')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeVisible();
    });

    it('should hide text when loading and hideTextOnLoading is true', () => {
      render(
        <Button loading hideTextOnLoading>
          Submit
        </Button>
      );

      const button = screen.getByRole('button');
      const content = button.querySelector('.btn-content');
      expect(content).toHaveStyle({ visibility: 'hidden' });
    });
  });

  describe('Full Width (Feature: 009-apple-hig-ui-redesign)', () => {
    it('should render full width when fullWidth is true', () => {
      render(<Button fullWidth>Full Width</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-full-width', 'w-full');
    });

    it('should not be full width by default', () => {
      render(<Button>Normal</Button>);

      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('btn-full-width');
      expect(button).not.toHaveClass('w-full');
    });
  });

  describe('Icons (Feature: 009-apple-hig-ui-redesign)', () => {
    it('should render with left icon', () => {
      render(<Button leftIcon={<span data-testid="left-icon">←</span>}>Back</Button>);

      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('should render with right icon', () => {
      render(<Button rightIcon={<span data-testid="right-icon">→</span>}>Next</Button>);

      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('should render with both icons', () => {
      render(
        <Button
          leftIcon={<span data-testid="left-icon">←</span>}
          rightIcon={<span data-testid="right-icon">→</span>}
        >
          Both
        </Button>
      );

      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      expect(screen.getByText('Both')).toBeInTheDocument();
    });

    it('should render icon-only button', () => {
      render(<Button aria-label="Delete" leftIcon={<span data-testid="icon">×</span>} />);

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Delete');
    });
  });

  describe('Ref Forwarding (Feature: 009-apple-hig-ui-redesign)', () => {
    it('should forward ref to button element', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Button</Button>);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLButtonElement);
    });

    it('should allow ref to access button methods', () => {
      const ref = { current: null as HTMLButtonElement | null };
      render(<Button ref={ref}>Button</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.focus).toBeDefined();
      expect(ref.current?.click).toBeDefined();
    });
  });

  describe('Enhanced Accessibility (Feature: 009-apple-hig-ui-redesign)', () => {
    it('should have aria-disabled when disabled', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have aria-disabled when loading', () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have aria-busy when loading', () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('should have gap between icon and text for better readability', () => {
      render(<Button leftIcon={<span>←</span>}>Back</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('gap-2');
    });
  });

  describe('Combined New Features (Feature: 009-apple-hig-ui-redesign)', () => {
    it('should handle destructive variant with loading', () => {
      render(
        <Button variant="destructive" loading>
          Deleting...
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-destructive', 'btn-loading');
      expect(button).toBeDisabled();
    });

    it('should handle full width tertiary button with icons', () => {
      render(
        <Button variant="tertiary" fullWidth leftIcon={<span data-testid="icon">⚙</span>}>
          Settings
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-tertiary', 'btn-full-width', 'w-full');
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should handle all props together', () => {
      const handleClick = vi.fn();
      render(
        <Button
          variant="destructive"
          size="lg"
          fullWidth
          leftIcon={<span>⚠</span>}
          className="custom"
          onClick={handleClick}
        >
          Delete All
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-destructive', 'btn-lg', 'btn-full-width', 'custom');

      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
