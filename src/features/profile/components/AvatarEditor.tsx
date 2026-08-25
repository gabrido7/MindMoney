import { useRef, useState } from "react";
import Icon from "../../../components/ui/Icon";
import { API_ORIGIN, ApiError } from "../../../services/api";
import { usersService } from "../../../services/usersService";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/useToast";

const MAX_SIZE_BYTES = 2 * 1024 * 1024;

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function AvatarEditor({ size = 88 }: { size?: number }) {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handlePick = () => inputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite escolher o mesmo arquivo de novo depois
    if (!file) return;

    if (file.size > MAX_SIZE_BYTES) {
      setError("Imagem muito grande (máximo 2MB).");
      return;
    }

    setError(null);
    setBusy(true);
    try {
      const { user: updated } = await usersService.uploadAvatar(file);
      updateUser(updated);
      showToast("Foto de perfil atualizada.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível enviar a imagem.");
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    setBusy(true);
    setError(null);
    try {
      const { user: updated } = await usersService.removeAvatar();
      updateUser(updated);
      showToast("Foto de perfil removida.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível remover a imagem.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        {/* A imagem nunca "quebra" o layout: contêiner sempre no tamanho fixo,
            object-cover corta a imagem em vez de deformar ou vazar. */}
        <div
          className="h-full w-full overflow-hidden rounded-full border border-line bg-brand-soft flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          {user.avatarUrl ? (
            <img
              src={`${API_ORIGIN}${user.avatarUrl}`}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <span className="font-data font-bold text-brand-deep" style={{ fontSize: size / 2.6 }}>
              {initialsFrom(user.name)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handlePick}
          disabled={busy}
          aria-label="Alterar foto de perfil"
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-bg shadow-card border-2 border-surface transition-transform hover:scale-105 disabled:opacity-50"
        >
          <Icon name="camera" size={15} />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {user.avatarUrl && (
        <button
          type="button"
          onClick={handleRemove}
          disabled={busy}
          className="text-xs font-medium text-ink-soft hover:text-negative disabled:opacity-50"
        >
          Remover foto
        </button>
      )}

      {error && <p className="text-xs text-negative text-center max-w-[180px]">{error}</p>}
    </div>
  );
}
