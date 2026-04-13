'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { StreakBadge } from '@/components/ui/StreakBadge';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
import { getStreak, getQuizHistory, getWeakIds, getProgress } from '@/lib/localStorage';
import { drugs } from '@/lib/drugs';
import type { StreakData, QuizSession } from '@/types/drug';

const modes = [
  {
    href: '/study',
    icon: '📖',
    label: '学習モード',
    desc: 'カテゴリ別に薬剤を確認',
    color: 'bg-blue-500',
  },
  {
    href: '/flashcard',
    icon: '🃏',
    label: '暗記モード',
    desc: 'フラッシュカードで暗記',
    color: 'bg-purple-500',
  },
  {
    href: '/quiz',
    icon: '✏️',
    label: 'テストモード',
    desc: '用量を答えて採点',
    color: 'bg-green-500',
  },
  {
    href: '/weak',
    icon: '💪',
    label: '弱点克服',
    desc: '間違えた薬剤を集中練習',
    color: 'bg-red-500',
  },
];

export default function HomePage() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [lastQuiz, setLastQuiz] = useState<QuizSession | null>(null);
  const [weakCount, setWeakCount] = useState(0);
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    setStreak(getStreak());
    const history = getQuizHistory();
    if (history.length > 0) setLastQuiz(history[0]);
    setWeakCount(getWeakIds().length);

    const progress = getProgress();
    const today = new Date().toISOString().split('T')[0];
    const due = drugs.filter((d) => {
      const p = progress[d.id];
      return !p || p.nextReviewDate <= today;
    }).length;
    setDueCount(due);
  }, []);

  return (
    <div className="px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">小児薬量ドリル</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">💊 {drugs.length}剤収録</p>
        </div>
        <DarkModeToggle />
      </div>

      {/* Streak */}
      {streak && streak.currentStreak > 0 && (
        <div className="mb-4">
          <StreakBadge streak={streak.currentStreak} />
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dueCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">要復習</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-2xl font-bold text-red-500 dark:text-red-400">{weakCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">弱点</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {lastQuiz ? `${Math.round((lastQuiz.correctCount / lastQuiz.totalQuestions) * 100)}%` : '-'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">前回正答率</p>
        </div>
      </div>

      {/* Mode buttons */}
      <div className="grid grid-cols-2 gap-3">
        {modes.map((mode) => (
          <Link
            key={mode.href}
            href={mode.href}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm active:scale-95 transition-transform"
          >
            <div className={`w-10 h-10 ${mode.color} rounded-xl flex items-center justify-center text-2xl mb-2`}>
              {mode.icon}
            </div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">{mode.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{mode.desc}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="flex gap-3 mt-4">
        <Link
          href="/search"
          className="flex-1 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-700 dark:text-gray-300 shadow-sm active:scale-95 transition-transform"
        >
          🔍 <span>薬剤を検索</span>
        </Link>
        <Link
          href="/print"
          className="flex-1 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-700 dark:text-gray-300 shadow-sm active:scale-95 transition-transform"
        >
          🖨️ <span>チートシート</span>
        </Link>
      </div>
    </div>
  );
}
