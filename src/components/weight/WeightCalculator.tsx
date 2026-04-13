'use client';

import { useState } from 'react';
import { calculateDose, isWeightBasedDosage } from '@/lib/weightCalculator';

interface Props {
  dosage: string;
}

export function WeightCalculator({ dosage }: Props) {
  const [weight, setWeight] = useState<number>(10);

  if (!isWeightBasedDosage(dosage)) return null;

  const result = calculateDose(dosage, weight);

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
      <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-3">
        ⚖️ 体重別用量計算
      </p>
      <div className="flex items-center gap-3 mb-3">
        <label className="text-sm text-gray-700 dark:text-gray-300 shrink-0">体重</label>
        <input
          type="range"
          min={3}
          max={60}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="flex-1 accent-green-600"
        />
        <div className="flex items-center gap-1 shrink-0">
          <input
            type="number"
            min={1}
            max={100}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-16 text-center text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">kg</span>
        </div>
      </div>
      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {result.calculated}
          </p>
          {result.note && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">※ {result.note}</p>
          )}
        </div>
      )}
    </div>
  );
}
