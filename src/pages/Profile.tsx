import Card from "../components/ui/Card";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import { useApiRequest } from "../hooks/useApiRequest";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

export default function Profile() {
  const { logout } = useAuth();
  const { data, loading, error } = useApiRequest(() => authService.me(), []);

  return (
    <div className="max-w-xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Perfil</h1>

      <Card>
        {loading && <p className="text-gray-500 dark:text-gray-400">Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {data && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-300">
                <Icon name="user" size={22} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{data.user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{data.user.email}</p>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              Conta criada em {new Date(data.user.createdAt).toLocaleDateString("pt-BR")}
            </p>

            <Button variant="secondary" onClick={logout} className="w-fit">
              <Icon name="logout" size={16} />
              Sair
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
