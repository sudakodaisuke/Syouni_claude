'use client';

import { useState } from 'react';

interface Props {
  front: React.ReactNode;
  back: React.ReactNode;
  onFlip?: () => void;
}

export function FlashCard({ front, back, onFlip }: Props) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
    onFlip?.();
  };

  return (
    <div
      className="w-full cursor-pointer select-none"
      style={{ perspective: '1000px' }}
      onClick={handleFlip}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          minHeight: '280px',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl border-2 border-blue-200 dark:border-blue-700 p-5 flex flex-col justify-center shadow-md"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
            タップして用量を確認 →
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border-2 border-blue-400 dark:border-blue-600 p-5 flex flex-col justify-center shadow-md"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
