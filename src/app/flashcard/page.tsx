'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { getCategories, drugs as allDrugs } from '@/lib/drugs';

export default function FlashcardConfigPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'starred' | 'category'>('all');
  const [category, setCategory] = useState('');
  const categories = getCategories();

  const getCount = () => {
    if (filter === 'starred') return allDrugs.filter((d) => d.is_important).length;
    if (filter === 'category' && category) return allDrugs.filter((d) => d.category === category).length;
    return allDrugs.length;
  };

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set('filter', filter);
    if (filter === 'category' && category) params.set('category', category);
    router.push(`/flashcard/session?${params.toString()}`);
  };

  return (
    <>
      <Header title="暗記モード" />
      <div className="px-4 pt-4 space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          フラッシュカードで用量を暗記しましょう
        </p>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">範囲を選択</p>
          {[
            { value: 'all', label: '全薬剤', desc: `${allDrugs.length}剤` },
            { value: 'starred', label: '⭐ 重要薬のみ', desc: `${allDrugs.filter((d) => d.is_important).length}剤` },
            { value: 'category', label: 'カテゴリを選ぶ', desc: '' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value as typeof filter)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 text-left transition-colors ${
                filter === opt.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            >
              <span className="text-sm font-medium">{opt.label}</span>
              {opt.desc && <span className="text-xs text-gray-500 dark:text-gray-400">{opt.desc}</span>}
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
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
              >
                {cat} ({allDrugs.filter((d) => d.category === cat).length}剤)
              </button>
            ))}
          </div>
        )}

        <div className="pt-2">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            {getCount()}枚のカード
          </p>
          <button
            onClick={handleStart}
            disabled={filter === 'category' && !category}
            className="w-full py-4 rounded-xl bg-purple-600 text-white font-bold text-base disabled:opacity-50 active:scale-95 transition-transform"
          >
            暗記開始 🃏
          </button>
        </div>
      </div>
    </>
  );
}
