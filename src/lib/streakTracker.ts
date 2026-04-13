import type { StreakData } from '@/types/drug';
import { getStreak, setStreak } from '@/lib/localStorage';

export function recordStudyToday(): StreakData {
  const today = new Date().toISOString().split('T')[0];
  const streak = getStreak();

  if (streak.lastStudyDate === today) {
    return streak; // Already recorded today
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const isConsecutive = streak.lastStudyDate === yesterdayStr;
  const newStreak = isConsecutive ? streak.currentStreak + 1 : 1;

  const updatedDates = [...new Set([...streak.studyDates, today])]
    .sort()
    .slice(-90);

  const updated: StreakData = {
    currentStreak: newStreak,
    longestStreak: Math.max(streak.longestStreak, newStreak),
    lastStudyDate: today,
    studyDates: updatedDates,
  };

  setStreak(updated);
  return updated;
}

export function getTodayStudied(): boolean {
  const streak = getStreak();
  const today = new Date().toISOString().split('T')[0];
  return streak.lastStudyDate === today;
}
