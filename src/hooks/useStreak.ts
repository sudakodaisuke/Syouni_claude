'use client';

import { useState, useEffect } from 'react';
import type { StreakData } from '@/types/drug';
import { getStreak } from '@/lib/localStorage';
import { recordStudyToday } from '@/lib/streakTracker';

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: '',
    studyDates: [],
  });

  useEffect(() => {
    setStreak(getStreak());
  }, []);

  const recordToday = () => {
    const updated = recordStudyToday();
    setStreak(updated);
  };

  return { streak, recordToday };
}
