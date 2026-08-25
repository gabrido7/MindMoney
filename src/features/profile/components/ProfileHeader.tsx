import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import AvatarEditor from "./AvatarEditor";
import { useAuth } from "../../../hooks/useAuth";
import { useGamification } from "../../gamification/hooks/useGamification";

export default function ProfileHeader({ onEditClick }: { onEditClick: () => void }) {
  const { user } = useAuth();
  const { summary } = useGamification();

  if (!user) return null;

  return (
    <Card className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
      <AvatarEditor />

      <div className="flex-1 min-w-0">
        <h1 className="font-display text-xl font-semibold text-ink truncate">{user.name}</h1>
        <p className="text-sm text-ink-soft truncate">{user.email}</p>

        {summary && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="font-data inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-deep">
              LVL {summary.level}
            </span>
            {summary.streak > 0 && (
              <span className="font-data inline-flex items-center gap-1 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning">
                🔥 {summary.streak} {summary.streak === 1 ? "dia" : "dias"}
              </span>
            )}
          </div>
        )}
      </div>

      <Button variant="secondary" onClick={onEditClick} className="shrink-0">
        <Icon name="edit" size={15} />
        Editar perfil
      </Button>
    </Card>
  );
}
