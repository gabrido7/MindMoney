import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import { useSessions } from "../hooks/useSessions";
import { formatRelative } from "../utils/relativeTime";

export default function SessionsCard() {
  const { sessions, isLoading, revoke, isRevoking, revokeOthers, isRevokingOthers } = useSessions();
  const hasOtherSessions = sessions.some((s) => !s.current);

  return (
    <Card
      title="Sessões ativas"
      action={
        hasOtherSessions && (
          <Button variant="ghost" onClick={() => revokeOthers()} disabled={isRevokingOthers} className="text-xs">
            Encerrar as outras
          </Button>
        )
      }
    >
      {isLoading && <p className="text-sm text-ink-soft">Carregando...</p>}

      {!isLoading && sessions.length === 0 && (
        <EmptyState icon="monitor" message="Nenhuma sessão ativa encontrada." />
      )}

      <ul className="flex flex-col gap-2">
        {sessions.map((session) => (
          <li
            key={session.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-alt text-ink-soft">
                <Icon name="monitor" size={16} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate flex items-center gap-2">
                  {session.device}
                  {session.current && (
                    <span className="font-data shrink-0 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-deep">
                      Esta sessão
                    </span>
                  )}
                </p>
                <p className="text-xs text-ink-soft">
                  Último uso {session.lastUsedAt ? formatRelative(session.lastUsedAt) : "desconhecido"}
                </p>
              </div>
            </div>

            {!session.current && (
              <Button
                variant="ghost"
                onClick={() => revoke(session.id)}
                disabled={isRevoking}
                className="shrink-0 text-xs text-negative hover:bg-negative-soft"
              >
                Encerrar
              </Button>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
