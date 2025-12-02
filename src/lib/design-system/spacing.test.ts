/**
 * Tests for spacing utilities
 * Feature: 009-apple-hig-ui-redesign
 * Content deference through proper whitespace management
 */

import { describe, it, expect } from 'vitest';
import { getSpacingClassName, getSpacingValue, type SpacingSize } from './spacing';

describe('Spacing Utilities', () => {
  describe('getSpacingValue', () => {
    it('should return spacing value for xs', () => {
      expect(getSpacingValue('xs')).toBe('4px');
    });

    it('should return spacing value for sm', () => {
      expect(getSpacingValue('sm')).toBe('8px');
    });

    it('should return spacing value for md', () => {
      expect(getSpacingValue('md')).toBe('16px');
    });

    it('should return spacing value for lg', () => {
      expect(getSpacingValue('lg')).toBe('24px');
    });

    it('should return spacing value for xl', () => {
      expect(getSpacingValue('xl')).toBe('32px');
    });

    it('should return spacing value for 2xl', () => {
      expect(getSpacingValue('2xl')).toBe('48px');
    });

    it('should return spacing value for 3xl', () => {
      expect(getSpacingValue('3xl')).toBe('64px');
    });

    it('should return spacing value for none', () => {
      expect(getSpacingValue('none')).toBe('0');
    });
  });

  describe('getSpacingClassName', () => {
    describe('Margin', () => {
      it('should return margin class for all sides', () => {
        const className = getSpacingClassName({ margin: 'md' });
        expect(className).toContain('m-4');
      });

      it('should return margin-top class', () => {
        const className = getSpacingClassName({ marginTop: 'lg' });
        expect(className).toContain('mt-6');
      });

      it('should return margin-bottom class', () => {
        const className = getSpacingClassName({ marginBottom: 'sm' });
        expect(className).toContain('mb-2');
      });

      it('should return margin-left class', () => {
        const className = getSpacingClassName({ marginLeft: 'md' });
        expect(className).toContain('ml-4');
      });

      it('should return margin-right class', () => {
        const className = getSpacingClassName({ marginRight: 'xl' });
        expect(className).toContain('mr-8');
      });

      it('should return margin-x class', () => {
        const className = getSpacingClassName({ marginX: 'lg' });
        expect(className).toContain('mx-6');
      });

      it('should return margin-y class', () => {
        const className = getSpacingClassName({ marginY: '2xl' });
        expect(className).toContain('my-12');
      });

      it('should return margin class for none', () => {
        const className = getSpacingClassName({ margin: 'none' });
        expect(className).toContain('m-0');
      });
    });

    describe('Padding', () => {
      it('should return padding class for all sides', () => {
        const className = getSpacingClassName({ padding: 'md' });
        expect(className).toContain('p-4');
      });

      it('should return padding-top class', () => {
        const className = getSpacingClassName({ paddingTop: 'lg' });
        expect(className).toContain('pt-6');
      });

      it('should return padding-bottom class', () => {
        const className = getSpacingClassName({ paddingBottom: 'sm' });
        expect(className).toContain('pb-2');
      });

      it('should return padding-left class', () => {
        const className = getSpacingClassName({ paddingLeft: 'md' });
        expect(className).toContain('pl-4');
      });

      it('should return padding-right class', () => {
        const className = getSpacingClassName({ paddingRight: 'xl' });
        expect(className).toContain('pr-8');
      });

      it('should return padding-x class', () => {
        const className = getSpacingClassName({ paddingX: 'lg' });
        expect(className).toContain('px-6');
      });

      it('should return padding-y class', () => {
        const className = getSpacingClassName({ paddingY: '2xl' });
        expect(className).toContain('py-12');
      });

      it('should return padding class for none', () => {
        const className = getSpacingClassName({ padding: 'none' });
        expect(className).toContain('p-0');
      });
    });

    describe('Gap', () => {
      it('should return gap class', () => {
        const className = getSpacingClassName({ gap: 'md' });
        expect(className).toContain('gap-4');
      });

      it('should return gap-x class', () => {
        const className = getSpacingClassName({ gapX: 'lg' });
        expect(className).toContain('gap-x-6');
      });

      it('should return gap-y class', () => {
        const className = getSpacingClassName({ gapY: 'sm' });
        expect(className).toContain('gap-y-2');
      });
    });

    describe('Combined Properties', () => {
      it('should combine margin and padding', () => {
        const className = getSpacingClassName({
          margin: 'md',
          padding: 'lg',
        });
        expect(className).toContain('m-4');
        expect(className).toContain('p-6');
      });

      it('should combine multiple spacing properties', () => {
        const className = getSpacingClassName({
          marginTop: 'lg',
          marginBottom: 'md',
          paddingX: 'xl',
          gap: 'sm',
        });
        expect(className).toContain('mt-6');
        expect(className).toContain('mb-4');
        expect(className).toContain('px-8');
        expect(className).toContain('gap-2');
      });

      it('should handle all spacing properties', () => {
        const className = getSpacingClassName({
          margin: 'sm',
          marginTop: 'md',
          padding: 'lg',
          gap: 'xs',
        });
        expect(className).toBeTruthy();
      });
    });

    describe('Edge Cases', () => {
      it('should return empty string for no properties', () => {
        const className = getSpacingClassName({});
        expect(className).toBe('');
      });

      it('should handle undefined values gracefully', () => {
        const className = getSpacingClassName({
          margin: undefined,
          padding: 'md',
        });
        expect(className).toContain('p-4');
        expect(className).not.toContain('m-');
      });
    });
  });

  describe('Type Safety', () => {
    it('should accept all valid spacing sizes', () => {
      const sizes: SpacingSize[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];

      sizes.forEach((size) => {
        expect(() => getSpacingValue(size)).not.toThrow();
        expect(() => getSpacingClassName({ margin: size })).not.toThrow();
      });
    });
  });

  describe('Real-world Use Cases', () => {
    it('should work for card spacing', () => {
      const className = getSpacingClassName({
        padding: 'lg',
        marginBottom: 'md',
      });
      expect(className).toContain('p-6');
      expect(className).toContain('mb-4');
    });

    it('should work for section spacing', () => {
      const className = getSpacingClassName({
        marginY: '3xl',
        paddingX: 'xl',
      });
      expect(className).toContain('my-16');
      expect(className).toContain('px-8');
    });

    it('should work for flex container spacing', () => {
      const className = getSpacingClassName({
        gap: 'md',
        padding: 'lg',
      });
      expect(className).toContain('gap-4');
      expect(className).toContain('p-6');
    });
  });
});
