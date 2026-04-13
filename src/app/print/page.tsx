import { Header } from '@/components/layout/Header';
import { PrintButton } from '@/components/ui/PrintButton';
import { getCategories, getDrugsByCategory } from '@/lib/drugs';

export default function PrintPage() {
  const categories = getCategories();

  return (
    <>
      <Header
        title="チートシート"
        rightSlot={<PrintButton />}
      />
      <div className="px-4 pt-4 pb-8">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          ブラウザの印刷機能でPDF保存が可能です
        </p>

        {categories.map((category) => {
          const drugs = getDrugsByCategory(category);
          return (
            <div key={category} className="mb-6 print-break">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg mb-2">
                {category} ({drugs.length}剤)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                      <th className="border border-gray-200 dark:border-gray-700 px-2 py-1.5 text-left font-medium text-gray-600 dark:text-gray-400">
                        商品名
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-2 py-1.5 text-left font-medium text-gray-600 dark:text-gray-400">
                        一般名
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-2 py-1.5 text-left font-medium text-gray-600 dark:text-gray-400">
                        用量
                      </th>
                      <th className="border border-gray-200 dark:border-gray-700 px-2 py-1.5 text-left font-medium text-gray-600 dark:text-gray-400">
                        メモ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {drugs.map((drug) => (
                      <tr key={drug.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <td className="border border-gray-200 dark:border-gray-700 px-2 py-1.5 text-gray-900 dark:text-white">
                          {drug.is_important && <span className="text-yellow-500 mr-1">★</span>}
                          {drug.trade_name}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-2 py-1.5 text-gray-700 dark:text-gray-300">
                          {drug.generic_name}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-2 py-1.5 font-mono text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                          {drug.dosage}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-2 py-1.5 text-gray-600 dark:text-gray-400">
                          {drug.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
