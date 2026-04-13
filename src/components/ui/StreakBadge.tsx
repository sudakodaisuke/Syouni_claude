interface Props {
  streak: number;
}

export function StreakBadge({ streak }: Props) {
  if (streak === 0) return null;
  return (
    <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-sm font-bold">
      🔥 {streak}日連続
    </div>
  );
}
