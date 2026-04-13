import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { DrugCard } from '@/components/drug/DrugCard';
import { WeightCalculator } from '@/components/weight/WeightCalculator';
import { CommentSection } from '@/components/comments/CommentSection';
import { getDrugById, drugs } from '@/lib/drugs';

interface Props {
  params: Promise<{ category: string; id: string }>;
}

export function generateStaticParams() {
  return drugs.map((d) => ({
    category: encodeURIComponent(d.category),
    id: String(d.id),
  }));
}

export default async function DrugDetailPage({ params }: Props) {
  const { category: encodedCategory, id } = await params;
  const category = decodeURIComponent(encodedCategory);
  const drug = getDrugById(Number(id));
  if (!drug) notFound();

  return (
    <>
      <Header title={drug.trade_name} backHref={`/study/${encodeURIComponent(category)}`} />
      <div className="px-4 pt-4 space-y-4">
        <DrugCard drug={drug} showDosage={true} />
        <WeightCalculator dosage={drug.dosage} />
        <CommentSection drugId={drug.id} />
      </div>
    </>
  );
}
