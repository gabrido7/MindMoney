import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

export default function Goals() {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Metas</h1>
      <Card>
        <EmptyState
          icon="target"
          message="Em breve: histórico completo de metas por mês, usando a API (GET/POST/PUT/DELETE /api/goals). Hoje a meta do mês ainda vive dentro do Dashboard."
        />
      </Card>
    </div>
  );
}
