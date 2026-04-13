interface Props {
  notes: string;
}

export function ContraindicationAlert({ notes }: Props) {
  if (!notes) return null;

  const hasContraindication = notes.includes('禁');
  const lines = notes.split(/[、，,]/).map((s) => s.trim()).filter(Boolean);

  return (
    <div
      className={`rounded-lg p-3 text-sm ${
        hasContraindication
          ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
          : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
      }`}
    >
      <div className="font-medium mb-1">
        {hasContraindication ? '⚠️ 注意・禁忌' : '📋 用法メモ'}
      </div>
      <ul className="space-y-0.5">
        {lines.map((line, i) => (
          <li key={i} className={line.includes('禁') ? 'font-bold' : ''}>
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
