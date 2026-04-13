'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DrugProgress } from '@/types/drug';
import {
  getProgress,
  updateDrugProgress,
  getWeakIds,
  setWeakIds,
} from '@/lib/localStorage';
import { calculateNextReview } from '@/lib/spacedRepetition';

export function useProgress() {
  const [progress, setProgress] = useState<Record<number, DrugProgress>>({});

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const markCorrect = useCallback((drugId: number) => {
    const current = getProgress();
    const updated = calculateNextReview(current[drugId], 4);
    updated.drugId = drugId;
    updateDrugProgress(updated);
    setProgress({ ...current, [drugId]: updated });
  }, []);

  const markWrong = useCallback((drugId: number) => {
    const current = getProgress();
    const updated = calculateNextReview(current[drugId], 0);
    updated.drugId = drugId;
    updateDrugProgress(updated);
    setProgress({ ...current, [drugId]: updated });
  }, []);

  const saveWrongIds = useCallback((ids: number[]) => {
    setWeakIds(ids);
  }, []);

  const getWeakDrugIds = useCallback((): number[] => {
    return getWeakIds();
  }, []);

  return { progress, markCorrect, markWrong, saveWrongIds, getWeakDrugIds };
}
