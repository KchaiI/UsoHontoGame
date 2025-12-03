/**
 * Tests for Modal component
 * Feature: 009-apple-hig-ui-redesign
 * Modal dialog with proper elevation and accessibility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  beforeEach(() => {
    // Create portal root
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    // Clean up portal root
    const portalRoot = document.getElementById('modal-root');
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
  });

  describe('Rendering', () => {
    it('should not render when open is false', () => {
      render(
        <Modal open={false} onClose={() => {}}>
          <div>Modal Content</div>
        </Modal>
      );
      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    it('should render when open is true', () => {
      render(
        <Modal open onClose={() => {}}>
          <div>Modal Content</div>
        </Modal>
      );
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(
        <Modal open onClose={() => {}}>
          <h1>Title</h1>
          <p>Description</p>
          <button>Action</button>
        </Modal>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('should apply sm size class', () => {
      render(
        <Modal open onClose={() => {}} size="sm">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('modal-sm');
      expect(modal).toHaveClass('max-w-sm');
    });

    it('should apply md size class (default)', () => {
      render(
        <Modal open onClose={() => {}} size="md">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('modal-md');
      expect(modal).toHaveClass('max-w-lg');
    });

    it('should apply lg size class', () => {
      render(
        <Modal open onClose={() => {}} size="lg">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('modal-lg');
      expect(modal).toHaveClass('max-w-2xl');
    });

    it('should apply xl size class', () => {
      render(
        <Modal open onClose={() => {}} size="xl">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('modal-xl');
      expect(modal).toHaveClass('max-w-4xl');
    });

    it('should apply full size class', () => {
      render(
        <Modal open onClose={() => {}} size="full">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('modal-full');
      expect(modal).toHaveClass('max-w-full');
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(
        <Modal open onClose={onClose} showCloseButton>
          <div>Content</div>
        </Modal>
      );
      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not show close button by default', () => {
      render(
        <Modal open onClose={() => {}}>
          <div>Content</div>
        </Modal>
      );
      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
    });

    it('should show close button when showCloseButton is true', () => {
      render(
        <Modal open onClose={() => {}} showCloseButton>
          <div>Content</div>
        </Modal>
      );
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    it('should call onClose when backdrop is clicked and closeOnBackdropClick is true', () => {
      const onClose = vi.fn();
      render(
        <Modal open onClose={onClose} closeOnBackdropClick>
          <div>Content</div>
        </Modal>
      );
      const backdrop = screen.getByTestId('modal-backdrop');
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when backdrop is clicked and closeOnBackdropClick is false', () => {
      const onClose = vi.fn();
      render(
        <Modal open onClose={onClose} closeOnBackdropClick={false}>
          <div>Content</div>
        </Modal>
      );
      const backdrop = screen.getByTestId('modal-backdrop');
      fireEvent.click(backdrop);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should not close when clicking inside modal', () => {
      const onClose = vi.fn();
      render(
        <Modal open onClose={onClose} closeOnBackdropClick>
          <div>Content</div>
        </Modal>
      );
      const modalContent = screen.getByRole('dialog');
      fireEvent.click(modalContent);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have dialog role', () => {
      render(
        <Modal open onClose={() => {}}>
          <div>Content</div>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal attribute', () => {
      render(
        <Modal open onClose={() => {}}>
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
    });

    it('should support aria-label', () => {
      render(
        <Modal open onClose={() => {}} aria-label="Confirmation Dialog">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-label', 'Confirmation Dialog');
    });

    it('should support aria-describedby', () => {
      render(
        <Modal open onClose={() => {}} aria-describedby="modal-desc">
          <div id="modal-desc">Description</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-describedby', 'modal-desc');
    });
  });

  describe('Elevation', () => {
    it('should apply elevated shadow', () => {
      render(
        <Modal open onClose={() => {}}>
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('shadow-lg');
    });

    it('should apply modal z-index', () => {
      render(
        <Modal open onClose={() => {}}>
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('z-[400]');
    });
  });

  describe('Backdrop', () => {
    it('should render backdrop', () => {
      render(
        <Modal open onClose={() => {}}>
          <div>Content</div>
        </Modal>
      );
      expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
    });

    it('should have backdrop overlay styles', () => {
      render(
        <Modal open onClose={() => {}}>
          <div>Content</div>
        </Modal>
      );
      const backdrop = screen.getByTestId('modal-backdrop');
      expect(backdrop).toHaveClass('bg-black/50');
      expect(backdrop).toHaveClass('z-[300]');
    });
  });

  describe('Custom Classes', () => {
    it('should merge custom className with default classes', () => {
      render(
        <Modal open onClose={() => {}} className="custom-modal">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('custom-modal');
      expect(modal).toHaveClass('modal-base');
    });
  });

  describe('HTML Attributes', () => {
    it('should pass through data attributes', () => {
      render(
        <Modal open onClose={() => {}} data-testid="custom-modal">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByTestId('custom-modal');
      expect(modal).toBeInTheDocument();
    });

    it('should pass through id attribute', () => {
      render(
        <Modal open onClose={() => {}} id="my-modal">
          <div>Content</div>
        </Modal>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('id', 'my-modal');
    });
  });

  describe('Real-world Use Cases', () => {
    it('should work as confirmation dialog', () => {
      const onClose = vi.fn();
      const onConfirm = vi.fn();
      render(
        <Modal open onClose={onClose} size="sm" aria-label="Confirm Action">
          <h2>Are you sure?</h2>
          <p>This action cannot be undone.</p>
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </Modal>
      );
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);
      expect(onConfirm).toHaveBeenCalled();
    });

    it('should work as form dialog', () => {
      render(
        <Modal open onClose={() => {}} size="md" showCloseButton>
          <h2>Edit Profile</h2>
          <form>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <button type="submit">Save</button>
          </form>
        </Modal>
      );
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });
  });

  describe('Portal Rendering', () => {
    it('should render modal in portal root', () => {
      render(
        <Modal open onClose={() => {}}>
          <div>Portal Content</div>
        </Modal>
      );
      const portalRoot = document.getElementById('modal-root');
      expect(portalRoot?.textContent).toContain('Portal Content');
    });
  });
});
