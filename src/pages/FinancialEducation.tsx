import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

export default function FinancialEducation() {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Educação Financeira</h1>
      <Card>
        <EmptyState icon="book" message="Em breve: conteúdo e dicas de educação financeira." />
      </Card>
    </div>
  );
}
