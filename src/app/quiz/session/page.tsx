'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { Header } from '@/components/layout/Header';
import { drugs as allDrugs } from '@/lib/drugs';
import { useProgress } from '@/hooks/useProgress';
import { useStreak } from '@/hooks/useStreak';
import { addQuizSession } from '@/lib/localStorage';
import { v4 as uuidv4 } from 'uuid';
import type { Drug } from '@/types/drug';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function QuizSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { markCorrect, markWrong, saveWrongIds } = useProgress();
  const { recordToday } = useStreak();

  const [deck, setDeck] = useState<Drug[]>([]);
  const [index, setIndex] = useState(0);
  const [correctIds, setCorrectIds] = useState<number[]>([]);
  const [wrongIds, setWrongIds] = useState<number[]>([]);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const filter = searchParams.get('filter') ?? 'all';
    const category = searchParams.get('category') ?? '';
    const count = parseInt(searchParams.get('count') ?? '10', 10);

    let filtered = allDrugs;
    if (filter === 'starred') filtered = allDrugs.filter((d) => d.is_important);
    else if (filter === 'category' && category) filtered = allDrugs.filter((d) => d.category === category);

    const shuffled = shuffle(filtered);
    setDeck(count > 0 ? shuffled.slice(0, count) : shuffled);
    recordToday();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCorrect = () => {
    const drug = deck[index];
    markCorrect(drug.id);
    setCorrectIds((prev) => [...prev, drug.id]);
    next();
  };

  const handleWrong = () => {
    const drug = deck[index];
    markWrong(drug.id);
    setWrongIds((prev) => [...prev, drug.id]);
    next();
  };

  const next = () => {
    if (index + 1 >= deck.length) {
      finishQuiz();
    } else {
      setIndex((i) => i + 1);
    }
  };

  const finishQuiz = () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    const wrong = [...wrongIds];
    if (deck[index] && !correctIds.includes(deck[index].id) && !wrongIds.includes(deck[index].id)) {
      // shouldn't happen but guard
    }
    saveWrongIds(wrong);
    addQuizSession({
      id: uuidv4(),
      date: new Date().toISOString(),
      mode: 'all',
      totalQuestions: deck.length,
      correctCount: correctIds.length + (wrongIds.includes(deck[index]?.id) ? 0 : 0),
      wrongDrugIds: wrong,
      durationSeconds: duration,
    });

    const params = new URLSearchParams();
    params.set('correct', String(correctIds.length + 1 - (wrongIds.length > correctIds.length ? 1 : 0)));
    params.set('total', String(deck.length));
    params.set('wrong', JSON.stringify(wrong));
    router.push(`/quiz/results?${params.toString()}`);
  };

  if (deck.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">準備中...</p>
      </div>
    );
  }

  const current = deck[index];
  if (!current) return null;

  return (
    <>
      <Header title="テスト中" backHref="/quiz" />
      <div className="px-4 pt-4">
        <QuizQuestion
          drug={current}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
          current={index + 1}
          total={deck.length}
        />
      </div>
    </>
  );
}

export default function QuizSessionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-500">読み込み中...</div>}>
      <QuizSession />
    </Suspense>
  );
}
