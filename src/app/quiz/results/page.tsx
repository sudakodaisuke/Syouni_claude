'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { getDrugById } from '@/lib/drugs';
import { DrugCard } from '@/components/drug/DrugCard';

function QuizResults() {
  const searchParams = useSearchParams();
  const correct = parseInt(searchParams.get('correct') ?? '0', 10);
  const total = parseInt(searchParams.get('total') ?? '1', 10);
  const wrongParam = searchParams.get('wrong') ?? '[]';
  let wrongIds: number[] = [];
  try { wrongIds = JSON.parse(wrongParam); } catch { wrongIds = []; }

  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const grade = pct >= 90 ? '🏆' : pct >= 70 ? '😊' : pct >= 50 ? '😐' : '💪';

  return (
    <>
      <Header title="テスト結果" backHref="/quiz" />
      <div className="px-4 pt-4 space-y-5">
        {/* Score */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center shadow-sm">
          <p className="text-5xl mb-3">{grade}</p>
          <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">{pct}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            正解 {correct} / {total}問
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Link
            href="/quiz"
            className="flex-1 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-center text-sm active:scale-95 transition-transform"
          >
            もう一度
          </Link>
          {wrongIds.length > 0 && (
            <Link
              href="/weak"
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium text-center text-sm active:scale-95 transition-transform"
            >
              弱点を練習 ({wrongIds.length}問)
            </Link>
          )}
        </div>

        {/* Wrong answers review */}
        {wrongIds.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              ✗ 不正解だった薬剤 ({wrongIds.length}件)
            </h2>
            {wrongIds.map((id) => {
              const drug = getDrugById(id);
              if (!drug) return null;
              return <DrugCard key={id} drug={drug} showDosage={true} />;
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default function QuizResultsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-500">読み込み中...</div>}>
      <QuizResults />
    </Suspense>
  );
}
