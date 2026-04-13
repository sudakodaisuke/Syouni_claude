export function ImportantStar({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center text-yellow-400 ${className}`}
      title="重要薬"
      aria-label="重要薬"
    >
      ★
    </span>
  );
}
