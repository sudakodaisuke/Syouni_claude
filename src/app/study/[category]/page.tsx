import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { getDrugsByCategory, getCategories } from '@/lib/drugs';
import { ImportantStar } from '@/components/drug/ImportantStar';

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: encodeURIComponent(c) }));
}

export default async function CategoryPage({ params }: Props) {
  const { category: encodedCategory } = await params;
  const category = decodeURIComponent(encodedCategory);
  const categoryDrugs = getDrugsByCategory(category);
  if (categoryDrugs.length === 0) notFound();

  return (
    <>
      <Header title={category} backHref="/study" />
      <div className="px-4 pt-4 space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {categoryDrugs.length}剤
        </p>
        {categoryDrugs.map((drug) => (
          <Link
            key={drug.id}
            href={`/study/${encodeURIComponent(category)}/${drug.id}`}
            className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm active:scale-[0.98] transition-transform"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                {drug.is_important && <ImportantStar />}
                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                  {drug.trade_name}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{drug.generic_name}</p>
            </div>
            <span className="text-gray-400 dark:text-gray-500 mt-0.5">›</span>
          </Link>
        ))}
      </div>
    </>
  );
}
