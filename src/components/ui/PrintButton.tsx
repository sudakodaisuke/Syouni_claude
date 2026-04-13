'use client';

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="text-sm text-blue-600 dark:text-blue-400 font-medium"
    >
      🖨️ 印刷
    </button>
  );
}
