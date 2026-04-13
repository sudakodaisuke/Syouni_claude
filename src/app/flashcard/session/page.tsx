'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FlashCard } from '@/components/flashcard/FlashCard';
import { FlashCardControls } from '@/components/flashcard/FlashCardControls';
import { ImportantStar } from '@/components/drug/ImportantStar';
import { ContraindicationAlert } from '@/components/drug/ContraindicationAlert';
import { drugs as allDrugs } from '@/lib/drugs';
import { useProgress } from '@/hooks/useProgress';
import { useStreak } from '@/hooks/useStreak';
import type { Drug } from '@/types/drug';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function FlashcardSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { markCorrect, markWrong } = useProgress();
  const { recordToday } = useStreak();

  const [deck, setDeck] = useState<Drug[]>([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [key, setKey] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const filter = searchParams.get('filter') ?? 'all';
    const category = searchParams.get('category') ?? '';

    let filtered = allDrugs;
    if (filter === 'starred') filtered = allDrugs.filter((d) => d.is_important);
    else if (filter === 'category' && category) filtered = allDrugs.filter((d) => d.category === category);

    setDeck(shuffle(filtered));
    recordToday();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = deck[index];

  const handleAnswer = (isCorrect: boolean) => {
    if (!current) return;
    if (isCorrect) {
      markCorrect(current.id);
      setCorrect((c) => c + 1);
    } else {
      markWrong(current.id);
      setWrong((w) => w + 1);
    }

    if (index + 1 >= deck.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setKey((k) => k + 1);
    }
  };

  if (deck.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">カードを準備中...</p>
      </div>
    );
  }

  if (done) {
    const total = deck.length;
    const pct = Math.round((correct / total) * 100);
    return (
      <div className="px-4 pt-8 text-center space-y-4">
        <p className="text-5xl">🎉</p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">セッション完了！</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{pct}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            正解 {correct} / {total}枚
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/flashcard')}
            className="flex-1 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium active:scale-95 transition-transform"
          >
            もう一度設定
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium active:scale-95 transition-transform"
          >
            ホームへ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 space-y-4">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>{index + 1} / {deck.length}枚</span>
          <span>✓ {correct} ✗ {wrong}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all"
            style={{ width: `${(index / deck.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <FlashCard
        key={key}
        front={
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {current.is_important && <ImportantStar className="text-2xl" />}
              <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full">
                {current.category}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white break-words">
              {current.trade_name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{current.generic_name}</p>
            {current.notes && (
              <p className="text-xs text-amber-600 dark:text-amber-400">{current.notes}</p>
            )}
          </div>
        }
        back={
          <div className="space-y-3">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 text-center">用量</p>
            <p className="font-mono text-base text-center text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
              {current.dosage}
            </p>
            {current.notes && (
              <ContraindicationAlert notes={current.notes} />
            )}
          </div>
        }
      />

      {/* Controls */}
      <FlashCardControls
        onCorrect={() => handleAnswer(true)}
        onWrong={() => handleAnswer(false)}
      />
    </div>
  );
}

export default function FlashcardSessionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-500">読み込み中...</div>}>
      <FlashcardSession />
    </Suspense>
  );
}
