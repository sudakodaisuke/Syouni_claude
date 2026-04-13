import type { Drug } from '@/types/drug';
import { ImportantStar } from './ImportantStar';
import { ContraindicationAlert } from './ContraindicationAlert';

interface Props {
  drug: Drug;
  showDosage?: boolean;
  compact?: boolean;
}

export function DrugCard({ drug, showDosage = true, compact = false }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {drug.is_important && <ImportantStar />}
            <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full">
              {drug.category}
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1 break-words">
            {drug.trade_name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{drug.generic_name}</p>
        </div>
      </div>

      {showDosage && !compact && (
        <>
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">用量</p>
            <p className="text-sm font-mono text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
              {drug.dosage}
            </p>
          </div>
          {drug.notes && (
            <div className="mt-2">
              <ContraindicationAlert notes={drug.notes} />
            </div>
          )}
          {drug.memo && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">{drug.memo}</p>
          )}
        </>
      )}
    </div>
  );
}
