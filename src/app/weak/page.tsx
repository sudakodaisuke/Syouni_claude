'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { DrugCard } from '@/components/drug/DrugCard';
import { getDrugById } from '@/lib/drugs';
import { getWeakIds, setWeakIds, getProgress } from '@/lib/localStorage';
import { getDueDrugs } from '@/lib/spacedRepetition';
import { drugs as allDrugs } from '@/lib/drugs';
import type { Drug } from '@/types/drug';

export default function WeakPage() {
  const router = useRouter();
  const [weakDrugs, setWeakDrugs] = useState<Drug[]>([]);
  const [dueDrugs, setDueDrugs] = useState<Drug[]>([]);

  useEffect(() => {
    const weakIds = getWeakIds();
    const drugs = weakIds.map((id) => getDrugById(id)).filter(Boolean) as Drug[];
    setWeakDrugs(drugs);

    const progress = getProgress();
    const dueIds = getDueDrugs(progress, allDrugs.map((d) => d.id));
    const due = dueIds.map((id) => getDrugById(id)).filter(Boolean) as Drug[];
    setDueDrugs(due);
  }, []);

  const handleClearWeak = () => {
    setWeakIds([]);
    setWeakDrugs([]);
  };

  const startWeakQuiz = () => {
    const ids = weakDrugs.map((d) => d.id);
    const params = new URLSearchParams();
    params.set('filter', 'weak');
    params.set('ids', JSON.stringify(ids));
    router.push(`/quiz/session?${params.toString()}`);
  };

  return (
    <>
      <Header title="弱点克服モード" />
      <div className="px-4 pt-4 space-y-5">
        {/* Weak drugs section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              💪 弱点リスト ({weakDrugs.length}件)
            </h2>
            {weakDrugs.length > 0 && (
              <button
                onClick={handleClearWeak}
                className="text-xs text-red-500 dark:text-red-400"
              >
                クリア
              </button>
            )}
          </div>

          {weakDrugs.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 text-center text-sm text-gray-500 dark:text-gray-400">
              弱点リストは空です 🎉<br />テストで間違えると自動的に追加されます
            </div>
          ) : (
            <>
              <button
                onClick={startWeakQuiz}
                className="w-full py-3 mb-3 rounded-xl bg-red-500 text-white font-bold active:scale-95 transition-transform"
              >
                弱点をテスト ({weakDrugs.length}問)
              </button>
              <div className="space-y-2">
                {weakDrugs.map((drug) => (
                  <DrugCard key={drug.id} drug={drug} showDosage={true} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Due for review section */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
            🔁 今日の復習 ({dueDrugs.length}件)
          </h2>
          {dueDrugs.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 text-center text-sm text-gray-500 dark:text-gray-400">
              今日の復習はありません ✓
            </div>
          ) : (
            <div className="space-y-2">
              {dueDrugs.slice(0, 10).map((drug) => (
                <DrugCard key={drug.id} drug={drug} showDosage={false} compact />
              ))}
              {dueDrugs.length > 10 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  他 {dueDrugs.length - 10}件...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
