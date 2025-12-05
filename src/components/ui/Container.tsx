/**
 * Container Component
 * Feature: 009-apple-hig-ui-redesign - Phase 8: Responsive Design
 * Responsive container with max-width constraints
 */

'use client';

import { type HTMLAttributes, type ReactNode } from 'react';
import { classNames } from '@/lib/design-system/classNames';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Container maximum width */
  size?: ContainerSize;
  /** Center the container */
  centered?: boolean;
  /** Apply padding */
  padding?: boolean;
  /** Children elements */
  children: ReactNode;
  /** Custom className */
  className?: string;
}

/**
 * Container Component
 *
 * Responsive container with max-width constraints and automatic centering.
 * Provides consistent spacing and alignment across breakpoints.
 *
 * @example
 * ```tsx
 * <Container size="lg">
 *   <h1>Page Title</h1>
 *   <p>Content goes here</p>
 * </Container>
 * ```
 *
 * @example
 * ```tsx
 * <Container size="xl" padding centered>
 *   <div>Centered content with padding</div>
 * </Container>
 * ```
 */
export function Container({
  size = 'xl',
  centered = true,
  padding = true,
  children,
  className,
  ...props
}: ContainerProps) {
  const sizeStyles = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const containerClassName = classNames(
    'container-base',
    'w-full',
    sizeStyles[size],
    centered && 'mx-auto',
    padding && 'px-4 sm:px-6 lg:px-8',
    className
  );

  return (
    <div className={containerClassName} {...props}>
      {children}
    </div>
  );
}
