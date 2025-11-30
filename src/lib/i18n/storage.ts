/**
 * localStorage Persistence Utilities
 * Feature: 008-i18n-support / US2
 *
 * Handles reading and writing language preference to localStorage
 */

import { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from './constants';
import type { Language } from './types';

/**
 * Get stored language from localStorage
 *
 * @returns Stored language if valid, null otherwise
 */
export function getStoredLanguage(): Language | null {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    // Validate that stored value is a supported language
    if (SUPPORTED_LANGUAGES.includes(stored as Language)) {
      return stored as Language;
    }

    return null;
  } catch (error) {
    // localStorage might not be available (SSR, privacy mode, etc.)
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to read language from localStorage:', error);
    }
    return null;
  }
}

/**
 * Store language preference to localStorage
 *
 * @param language - Language to store
 */
export function setStoredLanguage(language: Language): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    // localStorage might not be available (SSR, privacy mode, etc.)
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to save language to localStorage:', error);
    }
  }
}
