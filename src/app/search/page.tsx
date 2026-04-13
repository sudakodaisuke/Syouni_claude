'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { searchDrugs } from '@/lib/drugs';
import { ImportantStar } from '@/components/drug/ImportantStar';
import type { Drug } from '@/types/drug';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Drug[]>([]);
  const [searched, setSearched] = useState(false);

  const handleChange = (q: string) => {
    setQuery(q);
    if (q.trim().length >= 1) {
      setResults(searchDrugs(q.trim()));
      setSearched(true);
    } else {
      setResults([]);
      setSearched(false);
    }
  };

  return (
    <>
      <Header title="薬剤検索" />
      <div className="px-4 pt-4 space-y-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="search"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="商品名・一般名で検索..."
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            autoFocus
          />
        </div>

        {!searched && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
            薬剤名を入力して検索
          </p>
        )}

        {searched && results.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
            「{query}」に一致する薬剤はありません
          </p>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">{results.length}件の結果</p>
            {results.map((drug) => (
              <Link
                key={drug.id}
                href={`/study/${encodeURIComponent(drug.category)}/${drug.id}`}
                className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm active:scale-[0.98] transition-transform"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {drug.is_important && <ImportantStar />}
                    <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full">
                      {drug.category}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm mt-0.5 break-words">
                    {drug.trade_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{drug.generic_name}</p>
                </div>
                <span className="text-gray-400 dark:text-gray-500 mt-1">›</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
