'use client';

import { useState } from 'react';
import type { Drug } from '@/types/drug';
import { ImportantStar } from '@/components/drug/ImportantStar';
import { ContraindicationAlert } from '@/components/drug/ContraindicationAlert';

interface Props {
  drug: Drug;
  onCorrect: () => void;
  onWrong: () => void;
  current: number;
  total: number;
}

export function QuizQuestion({ drug, onCorrect, onWrong, current, total }: Props) {
  const [revealed, setRevealed] = useState(false);

  const handleReveal = () => setRevealed(true);

  const handleAnswer = (correct: boolean) => {
    if (correct) onCorrect();
    else onWrong();
    setRevealed(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>問題 {current} / {total}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${((current - 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-5 shadow-sm min-h-48">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {drug.is_important && <ImportantStar />}
          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full">
            {drug.category}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white break-words">{drug.trade_name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{drug.generic_name}</p>

        {revealed && (
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">用量</p>
              <p className="font-mono text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                {drug.dosage}
              </p>
            </div>
            {drug.notes && <ContraindicationAlert notes={drug.notes} />}
            {drug.memo && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">{drug.memo}</p>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!revealed ? (
        <button
          onClick={handleReveal}
          className="w-full py-4 rounded-xl text-base font-bold bg-blue-600 text-white active:scale-95 transition-transform"
        >
          回答を見る
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 py-4 rounded-xl text-base font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-700 active:scale-95 transition-transform"
          >
            ✗ 不正解
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 py-4 rounded-xl text-base font-bold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-2 border-green-200 dark:border-green-700 active:scale-95 transition-transform"
          >
            ✓ 正解
          </button>
        </div>
      )}
    </div>
  );
}
