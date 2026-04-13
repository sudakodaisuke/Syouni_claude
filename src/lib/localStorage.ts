import type { DrugProgress, QuizSession, StreakData, UserSettings } from '@/types/drug';

const KEYS = {
  DEVICE_ID: 'pdm_device_id',
  PROGRESS: 'pdm_progress',
  QUIZ_HISTORY: 'pdm_quiz_history',
  STREAK: 'pdm_streak',
  SETTINGS: 'pdm_settings',
  WEAK_IDS: 'pdm_weak_ids',
  LIKED_COMMENTS: 'pdm_liked_comments',
} as const;

function get<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
}

// Device ID
export function getDeviceId(): string | null {
  return get<string | null>(KEYS.DEVICE_ID, null);
}

export function setDeviceId(id: string): void {
  set(KEYS.DEVICE_ID, id);
}

// Progress (SM-2)
export function getProgress(): Record<number, DrugProgress> {
  return get<Record<number, DrugProgress>>(KEYS.PROGRESS, {});
}

export function setProgress(progress: Record<number, DrugProgress>): void {
  set(KEYS.PROGRESS, progress);
}

export function updateDrugProgress(drugProgress: DrugProgress): void {
  const all = getProgress();
  all[drugProgress.drugId] = drugProgress;
  setProgress(all);
}

// Quiz History
export function getQuizHistory(): QuizSession[] {
  return get<QuizSession[]>(KEYS.QUIZ_HISTORY, []);
}

export function addQuizSession(session: QuizSession): void {
  const history = getQuizHistory();
  history.unshift(session);
  set(KEYS.QUIZ_HISTORY, history.slice(0, 50));
}

// Streak
export function getStreak(): StreakData {
  return get<StreakData>(KEYS.STREAK, {
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: '',
    studyDates: [],
  });
}

export function setStreak(streak: StreakData): void {
  set(KEYS.STREAK, streak);
}

// Settings
export const DEFAULT_SETTINGS: UserSettings = {
  darkMode: 'system',
  flashcardShowContras: true,
  quizQuestionCount: 10,
  timerEnabled: false,
  timerSeconds: 30,
};

export function getSettings(): UserSettings {
  return { ...DEFAULT_SETTINGS, ...get<Partial<UserSettings>>(KEYS.SETTINGS, {}) };
}

export function setSettings(settings: UserSettings): void {
  set(KEYS.SETTINGS, settings);
}

// Weak IDs
export function getWeakIds(): number[] {
  return get<number[]>(KEYS.WEAK_IDS, []);
}

export function setWeakIds(ids: number[]): void {
  set(KEYS.WEAK_IDS, ids);
}

// Liked comments
export function getLikedComments(): string[] {
  return get<string[]>(KEYS.LIKED_COMMENTS, []);
}

export function toggleLikedComment(commentId: string): boolean {
  const liked = getLikedComments();
  const idx = liked.indexOf(commentId);
  if (idx >= 0) {
    liked.splice(idx, 1);
    set(KEYS.LIKED_COMMENTS, liked);
    return false;
  } else {
    liked.push(commentId);
    set(KEYS.LIKED_COMMENTS, liked);
    return true;
  }
}

export function isCommentLiked(commentId: string): boolean {
  return getLikedComments().includes(commentId);
}
