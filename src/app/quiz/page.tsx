'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { getCategories, drugs as allDrugs } from '@/lib/drugs';

const COUNTS = [5, 10, 20, 0] as const; // 0 = 全部

export default function QuizConfigPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'starred' | 'category'>('all');
  const [category, setCategory] = useState('');
  const [count, setCount] = useState<number>(10);
  const categories = getCategories();

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set('filter', filter);
    if (filter === 'category' && category) params.set('category', category);
    params.set('count', String(count));
    router.push(`/quiz/session?${params.toString()}`);
  };

  return (
    <>
      <Header title="テストモード" />
      <div className="px-4 pt-4 space-y-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          薬剤名を見て用量を思い出してみましょう
        </p>

        {/* Filter */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">出題範囲</p>
          {[
            { value: 'all', label: '全薬剤', count: allDrugs.length },
            { value: 'starred', label: '⭐ 重要薬のみ', count: allDrugs.filter((d) => d.is_important).length },
            { value: 'category', label: 'カテゴリを選ぶ', count: 0 },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value as typeof filter)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 text-left transition-colors ${
                filter === opt.value
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            >
              <span className="text-sm font-medium">{opt.label}</span>
              {opt.count > 0 && <span className="text-xs text-gray-500 dark:text-gray-400">{opt.count}剤</span>}
            </button>
          ))}
        </div>

        {filter === 'category' && (
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`w-full p-3 rounded-xl border-2 text-left text-sm transition-colors ${
                  category === cat
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Question count */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">問題数</p>
          <div className="grid grid-cols-4 gap-2">
            {COUNTS.map((c) => (
              <button
                key={c}
                onClick={() => setCount(c)}
                className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-colors ${
                  count === c
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
              >
                {c === 0 ? '全部' : c}問
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={filter === 'category' && !category}
          className="w-full py-4 rounded-xl bg-green-600 text-white font-bold text-base disabled:opacity-50 active:scale-95 transition-transform"
        >
          テスト開始 ✏️
        </button>
      </div>
    </>
  );
}
