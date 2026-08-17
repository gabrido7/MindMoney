import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

export default function Reports() {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Relatórios</h1>
      <Card>
        <EmptyState
          icon="chart"
          message="Em breve: relatórios detalhados por período, categoria e exportação, consumindo /api/dashboard e /api/transactions."
        />
      </Card>
    </div>
  );
}
