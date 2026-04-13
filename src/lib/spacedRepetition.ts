import type { DrugProgress } from '@/types/drug';

// SM-2 algorithm implementation
// quality: 0-5 (0-2 = wrong, 3-5 = correct)

export function calculateNextReview(
  progress: DrugProgress | undefined,
  quality: 0 | 1 | 2 | 3 | 4 | 5
): DrugProgress {
  const today = new Date().toISOString().split('T')[0];

  const current: DrugProgress = progress ?? {
    drugId: 0,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewDate: today,
    lastReviewDate: today,
    wrongCount: 0,
    correctCount: 0,
  };

  let { easeFactor, interval, repetitions } = current;

  if (quality >= 3) {
    // Correct answer
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);

    repetitions += 1;
    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else {
    // Wrong answer — reset
    repetitions = 0;
    interval = 1;
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    ...current,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: nextDate.toISOString().split('T')[0],
    lastReviewDate: today,
    wrongCount: quality < 3 ? current.wrongCount + 1 : current.wrongCount,
    correctCount: quality >= 3 ? current.correctCount + 1 : current.correctCount,
  };
}

export function isDueForReview(progress: DrugProgress): boolean {
  const today = new Date().toISOString().split('T')[0];
  return progress.nextReviewDate <= today;
}

export function getDueDrugs(
  progressMap: Record<number, DrugProgress>,
  drugIds: number[]
): number[] {
  return drugIds.filter((id) => {
    const p = progressMap[id];
    return !p || isDueForReview(p);
  });
}
