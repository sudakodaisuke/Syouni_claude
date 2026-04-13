export interface Drug {
  id: number;
  category: string;
  trade_name: string;
  generic_name: string;
  dosage: string;
  notes: string;
  is_important: boolean;
  memo: string;
}

export interface DrugProgress {
  drugId: number;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewDate: string;
  wrongCount: number;
  correctCount: number;
}

export interface QuizSession {
  id: string;
  date: string;
  mode: 'all' | 'category' | 'starred' | 'weak';
  filter?: string;
  totalQuestions: number;
  correctCount: number;
  wrongDrugIds: number[];
  durationSeconds: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  studyDates: string[];
}

export interface UserSettings {
  darkMode: 'light' | 'dark' | 'system';
  flashcardShowContras: boolean;
  quizQuestionCount: number;
  timerEnabled: boolean;
  timerSeconds: number;
}

export interface Comment {
  id: string;
  drug_id: number;
  device_id: string;
  body: string;
  created_at: string;
  like_count: number;
}
