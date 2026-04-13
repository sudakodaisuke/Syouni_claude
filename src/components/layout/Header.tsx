'use client';

import Link from 'next/link';

interface HeaderProps {
  title: string;
  backHref?: string;
  rightSlot?: React.ReactNode;
}

export function Header({ title, backHref, rightSlot }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center h-14 px-4 max-w-lg mx-auto gap-2">
        {backHref && (
          <Link
            href={backHref}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium mr-1 shrink-0"
          >
            ← 戻る
          </Link>
        )}
        <h1 className="text-base font-bold text-gray-900 dark:text-white flex-1 truncate">
          {title}
        </h1>
        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>
    </header>
  );
}
