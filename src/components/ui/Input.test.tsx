/**
 * Tests for Input component
 * Feature: 009-apple-hig-ui-redesign
 * Apple HIG-compliant input field with variants and states
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with value', () => {
      render(<Input value="Test value" onChange={() => {}} />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('Test value');
    });

    it('should render with label', () => {
      render(<Input label="Username" />);
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('should render with helper text', () => {
      render(<Input helperText="Enter your username" />);
      expect(screen.getByText('Enter your username')).toBeInTheDocument();
    });
  });

  describe('Input Types', () => {
    it('should render text input by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should render email input', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render password input', () => {
      render(<Input type="password" />);
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should render number input', () => {
      render(<Input type="number" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should render tel input', () => {
      render(<Input type="tel" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('should render url input', () => {
      render(<Input type="url" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'url');
    });

    it('should render search input', () => {
      render(<Input type="search" />);
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('type', 'search');
    });
  });

  describe('Sizes', () => {
    it('should apply sm size class', () => {
      const { container } = render(<Input size="sm" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('input-sm');
    });

    it('should apply md size class (default)', () => {
      const { container } = render(<Input size="md" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('input-md');
    });

    it('should apply lg size class', () => {
      const { container } = render(<Input size="lg" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('input-lg');
    });
  });

  describe('Variants', () => {
    it('should apply default variant', () => {
      const { container } = render(<Input variant="default" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('input-default');
    });

    it('should apply filled variant', () => {
      const { container } = render(<Input variant="filled" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('input-filled');
    });

    it('should apply outlined variant', () => {
      const { container } = render(<Input variant="outlined" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('input-outlined');
    });
  });

  describe('States', () => {
    it('should apply error state', () => {
      const { container } = render(<Input error errorMessage="Invalid input" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('input-error');
      expect(screen.getByText('Invalid input')).toBeInTheDocument();
    });

    it('should show error message without error prop', () => {
      render(<Input errorMessage="Error message" />);
      expect(screen.queryByText('Error message')).not.toBeInTheDocument();
    });

    it('should be disabled', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should apply disabled class', () => {
      const { container } = render(<Input disabled />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('input-disabled');
    });

    it('should be required', () => {
      render(<Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('should be readonly', () => {
      render(<Input readOnly />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });
  });

  describe('Icons', () => {
    it('should render left icon', () => {
      render(<Input leftIcon={<span data-testid="left-icon">←</span>} />);
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('should render right icon', () => {
      render(<Input rightIcon={<span data-testid="right-icon">→</span>} />);
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('should render both icons', () => {
      render(
        <Input
          leftIcon={<span data-testid="left-icon">←</span>}
          rightIcon={<span data-testid="right-icon">→</span>}
        />
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('Event Handlers', () => {
    it('should call onChange when input changes', () => {
      const onChange = vi.fn();
      render(<Input onChange={onChange} />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(onChange).toHaveBeenCalled();
    });

    it('should call onFocus when input is focused', () => {
      const onFocus = vi.fn();
      render(<Input onFocus={onFocus} />);
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      expect(onFocus).toHaveBeenCalled();
    });

    it('should call onBlur when input loses focus', () => {
      const onBlur = vi.fn();
      render(<Input onBlur={onBlur} />);
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      expect(onBlur).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper id when provided', () => {
      render(<Input id="username" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'username');
    });

    it('should link label to input with htmlFor', () => {
      render(<Input id="email" label="Email" />);
      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('for', 'email');
    });

    it('should have aria-label when provided', () => {
      render(<Input aria-label="Search" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Search');
    });

    it('should have aria-invalid when error', () => {
      render(<Input error />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have aria-describedby with helper text', () => {
      render(<Input id="test" helperText="Helper" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-helper');
    });

    it('should have aria-describedby with error message', () => {
      render(<Input id="test" error errorMessage="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-error');
    });
  });

  describe('Custom Classes', () => {
    it('should merge custom className', () => {
      const { container } = render(<Input className="custom-input" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('custom-input');
      expect(input).toHaveClass('input-base');
    });
  });

  describe('Real-world Use Cases', () => {
    it('should work as email input with validation', () => {
      render(
        <Input
          type="email"
          label="Email"
          placeholder="your@email.com"
          error
          errorMessage="Invalid email format"
        />
      );
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });

    it('should work as password input with label', () => {
      render(<Input type="password" label="Password" placeholder="Enter password" required />);
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
      expect(input).toBeRequired();
      expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    });

    it('should work as search input with icon', () => {
      render(
        <Input
          type="search"
          placeholder="Search..."
          leftIcon={<span data-testid="search-icon">🔍</span>}
        />
      );
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    });
  });

  describe('Base Styles', () => {
    it('should have input-base class', () => {
      const { container } = render(<Input />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('input-base');
    });
  });
});
