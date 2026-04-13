import drugsData from '@/data/drugs.json';
import type { Drug } from '@/types/drug';

export const drugs: Drug[] = drugsData as Drug[];

export function getDrugById(id: number): Drug | undefined {
  return drugs.find((d) => d.id === id);
}

export function getDrugsByCategory(category: string): Drug[] {
  return drugs.filter((d) => d.category === category);
}

export function getCategories(): string[] {
  const order = [
    'アレルギー薬',
    '抗生剤・抗ウイルス薬',
    '呼吸器系',
    'その他',
    'アレルギー薬（シロップ）',
    '呼吸器系（シロップ）',
    'その他（シロップ）',
    '坐剤',
  ];
  const all = [...new Set(drugs.map((d) => d.category))];
  return order.filter((c) => all.includes(c)).concat(all.filter((c) => !order.includes(c)));
}

export function searchDrugs(query: string): Drug[] {
  const q = query.toLowerCase();
  return drugs.filter(
    (d) =>
      d.trade_name.toLowerCase().includes(q) ||
      d.generic_name.toLowerCase().includes(q)
  );
}

export function getImportantDrugs(): Drug[] {
  return drugs.filter((d) => d.is_important);
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'アレルギー薬': '💊',
    '抗生剤・抗ウイルス薬': '🦠',
    '呼吸器系': '🫁',
    'その他': '📋',
    'アレルギー薬（シロップ）': '🍶',
    '呼吸器系（シロップ）': '🍶',
    'その他（シロップ）': '🍶',
    '坐剤': '💉',
  };
  return icons[category] ?? '💊';
}
