/**
 * Spacing Utilities
 * Feature: 009-apple-hig-ui-redesign
 * Content deference through proper whitespace management
 */

import { classNames } from './classNames';

/**
 * Spacing size values following 8px grid system
 */
export type SpacingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

/**
 * Spacing value map in pixels
 */
const spacingValueMap: Record<SpacingSize, string> = {
  none: '0',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
};

/**
 * Mapping from spacing size to Tailwind spacing class number
 * Based on Tailwind's default spacing scale where 1 = 4px
 */
const spacingClassMap: Record<SpacingSize, string> = {
  none: '0',
  xs: '1',
  sm: '2',
  md: '4',
  lg: '6',
  xl: '8',
  '2xl': '12',
  '3xl': '16',
};

/**
 * Get the pixel value for a spacing size
 *
 * @param size - The spacing size
 * @returns The pixel value as a string (e.g., '16px')
 *
 * @example
 * ```tsx
 * getSpacingValue('md') // '16px'
 * getSpacingValue('lg') // '24px'
 * ```
 */
export function getSpacingValue(size: SpacingSize): string {
  return spacingValueMap[size];
}

/**
 * Options for spacing class generation
 */
export interface SpacingOptions {
  /** Margin on all sides */
  margin?: SpacingSize;
  /** Margin top */
  marginTop?: SpacingSize;
  /** Margin bottom */
  marginBottom?: SpacingSize;
  /** Margin left */
  marginLeft?: SpacingSize;
  /** Margin right */
  marginRight?: SpacingSize;
  /** Margin horizontal (left and right) */
  marginX?: SpacingSize;
  /** Margin vertical (top and bottom) */
  marginY?: SpacingSize;
  /** Padding on all sides */
  padding?: SpacingSize;
  /** Padding top */
  paddingTop?: SpacingSize;
  /** Padding bottom */
  paddingBottom?: SpacingSize;
  /** Padding left */
  paddingLeft?: SpacingSize;
  /** Padding right */
  paddingRight?: SpacingSize;
  /** Padding horizontal (left and right) */
  paddingX?: SpacingSize;
  /** Padding vertical (top and bottom) */
  paddingY?: SpacingSize;
  /** Gap between flex/grid items */
  gap?: SpacingSize;
  /** Gap horizontal (column gap) */
  gapX?: SpacingSize;
  /** Gap vertical (row gap) */
  gapY?: SpacingSize;
}

/**
 * Generate Tailwind spacing class names from spacing options
 *
 * @param options - Spacing options for margin, padding, and gap
 * @returns Combined class name string
 *
 * @example
 * ```tsx
 * getSpacingClassName({ margin: 'md', padding: 'lg' })
 * // 'm-4 p-6'
 * ```
 *
 * @example
 * ```tsx
 * getSpacingClassName({ marginTop: 'lg', paddingX: 'xl', gap: 'sm' })
 * // 'mt-6 px-8 gap-2'
 * ```
 */
export function getSpacingClassName(options: SpacingOptions): string {
  const classes: string[] = [];

  // Margin classes
  if (options.margin !== undefined) {
    classes.push(`m-${spacingClassMap[options.margin]}`);
  }
  if (options.marginTop !== undefined) {
    classes.push(`mt-${spacingClassMap[options.marginTop]}`);
  }
  if (options.marginBottom !== undefined) {
    classes.push(`mb-${spacingClassMap[options.marginBottom]}`);
  }
  if (options.marginLeft !== undefined) {
    classes.push(`ml-${spacingClassMap[options.marginLeft]}`);
  }
  if (options.marginRight !== undefined) {
    classes.push(`mr-${spacingClassMap[options.marginRight]}`);
  }
  if (options.marginX !== undefined) {
    classes.push(`mx-${spacingClassMap[options.marginX]}`);
  }
  if (options.marginY !== undefined) {
    classes.push(`my-${spacingClassMap[options.marginY]}`);
  }

  // Padding classes
  if (options.padding !== undefined) {
    classes.push(`p-${spacingClassMap[options.padding]}`);
  }
  if (options.paddingTop !== undefined) {
    classes.push(`pt-${spacingClassMap[options.paddingTop]}`);
  }
  if (options.paddingBottom !== undefined) {
    classes.push(`pb-${spacingClassMap[options.paddingBottom]}`);
  }
  if (options.paddingLeft !== undefined) {
    classes.push(`pl-${spacingClassMap[options.paddingLeft]}`);
  }
  if (options.paddingRight !== undefined) {
    classes.push(`pr-${spacingClassMap[options.paddingRight]}`);
  }
  if (options.paddingX !== undefined) {
    classes.push(`px-${spacingClassMap[options.paddingX]}`);
  }
  if (options.paddingY !== undefined) {
    classes.push(`py-${spacingClassMap[options.paddingY]}`);
  }

  // Gap classes
  if (options.gap !== undefined) {
    classes.push(`gap-${spacingClassMap[options.gap]}`);
  }
  if (options.gapX !== undefined) {
    classes.push(`gap-x-${spacingClassMap[options.gapX]}`);
  }
  if (options.gapY !== undefined) {
    classes.push(`gap-y-${spacingClassMap[options.gapY]}`);
  }

  return classNames(...classes);
}
