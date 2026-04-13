import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { getCategories, getDrugsByCategory, getCategoryIcon } from '@/lib/drugs';

export default function StudyPage() {
  const categories = getCategories();

  return (
    <>
      <Header title="学習モード" />
      <div className="px-4 pt-4 space-y-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          カテゴリを選んで学習しましょう
        </p>
        {categories.map((category) => {
          const drugs = getDrugsByCategory(category);
          const importantCount = drugs.filter((d) => d.is_important).length;
          return (
            <Link
              key={category}
              href={`/study/${encodeURIComponent(category)}`}
              className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm active:scale-[0.98] transition-transform"
            >
              <span className="text-2xl">{getCategoryIcon(category)}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                  {category}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {drugs.length}剤
                  {importantCount > 0 && (
                    <span className="ml-2 text-yellow-500">★ 重要 {importantCount}剤</span>
                  )}
                </p>
              </div>
              <span className="text-gray-400 dark:text-gray-500">›</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
