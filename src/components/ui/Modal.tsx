/**
 * Modal Component
 * Feature: 009-apple-hig-ui-redesign
 * Modal dialog with proper elevation and accessibility
 */

'use client';

import { useEffect, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '@/lib/design-system/classNames';
import { getElevationClassName } from '@/lib/design-system/elevation';

/**
 * Modal size variants
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal content */
  children: ReactNode;
  /** Modal size */
  size?: ModalSize;
  /** Show close button in top-right */
  showCloseButton?: boolean;
  /** Close modal when backdrop is clicked */
  closeOnBackdropClick?: boolean;
  /** Additional CSS classes for modal content */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** ARIA described by for accessibility */
  'aria-describedby'?: string;
}

/**
 * Modal Component
 *
 * Apple HIG-compliant modal dialog with proper elevation, backdrop, and accessibility.
 * Renders in a portal for proper z-index layering.
 *
 * @example
 * ```tsx
 * <Modal open={isOpen} onClose={() => setIsOpen(false)} size="md">
 *   <h2>Modal Title</h2>
 *   <p>Modal content goes here</p>
 * </Modal>
 * ```
 *
 * @example
 * ```tsx
 * <Modal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   size="sm"
 *   showCloseButton
 *   closeOnBackdropClick
 *   aria-label="Confirmation Dialog"
 * >
 *   <p>Are you sure?</p>
 *   <button>Confirm</button>
 * </Modal>
 * ```
 */
export function Modal({
  open,
  onClose,
  children,
  size = 'md',
  showCloseButton = false,
  closeOnBackdropClick = false,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}: ModalProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  // Size styles
  const sizeStyles = {
    sm: classNames('modal-sm', 'max-w-sm'),
    md: classNames('modal-md', 'max-w-lg'),
    lg: classNames('modal-lg', 'max-w-2xl'),
    xl: classNames('modal-xl', 'max-w-4xl'),
    full: classNames('modal-full', 'max-w-full'),
  };

  // Modal container styles
  const modalClassName = classNames('fixed inset-0', 'flex items-center justify-center', 'p-4');

  // Modal content styles
  const contentClassName = classNames(
    'modal-base',
    'modal-content',
    'relative',
    'w-full',
    sizeStyles[size],
    'bg-white dark:bg-gray-800',
    'rounded-lg',
    'p-6',
    getElevationClassName({ level: 'elevated', zIndex: 'modal' }),
    className
  );

  // Backdrop styles
  const backdropClassName = classNames(
    'modal-backdrop',
    'fixed inset-0',
    'bg-black/50',
    getElevationClassName({ zIndex: 'overlay' })
  );

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className={backdropClassName}
        onClick={handleBackdropClick}
        data-testid="modal-backdrop"
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className={modalClassName} onClick={handleBackdropClick}>
        {/* Modal Content */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          className={contentClassName}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {/* Close Button */}
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Content */}
          {children}
        </div>
      </div>
    </>
  );

  // Render in portal
  const portalRoot = typeof document !== 'undefined' ? document.getElementById('modal-root') : null;

  if (!portalRoot) {
    // Fallback: render directly if portal root doesn't exist
    return modalContent;
  }

  return createPortal(modalContent, portalRoot);
}
