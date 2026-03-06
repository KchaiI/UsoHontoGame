/**
 * Header Component
 * Feature: 008-i18n-support / US1
 *
 * Application header with language switcher
 */

'use client';

import Link from 'next/link';
import { logoutAction } from '@/app/actions/session';
import { LanguageSwitcher } from './LanguageSwitcher';

/**
 * Header Component
 *
 * Renders application header with language switcher
 */
export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          href="/"
        >
        <div className="text-lg font-semibold text-gray-900">ウソホントゲーム</div>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/games"
          >
            ゲーム管理
          </Link>
          <Link
            href="/"
          >
            参加者TOP
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
            >
              ログアウト
            </button>
          </form>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
