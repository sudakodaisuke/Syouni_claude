'use client';

interface Props {
  onCorrect: () => void;
  onWrong: () => void;
  disabled?: boolean;
}

export function FlashCardControls({ onCorrect, onWrong, disabled = false }: Props) {
  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={onWrong}
        disabled={disabled}
        className="flex-1 py-4 rounded-xl text-base font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-700 active:scale-95 transition-transform disabled:opacity-50"
      >
        😣 もう一度
      </button>
      <button
        onClick={onCorrect}
        disabled={disabled}
        className="flex-1 py-4 rounded-xl text-base font-bold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-2 border-green-200 dark:border-green-700 active:scale-95 transition-transform disabled:opacity-50"
      >
        😊 覚えた
      </button>
    </div>
  );
}
