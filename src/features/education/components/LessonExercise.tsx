import { useState } from "react";
import Button from "../../../components/ui/Button";

export default function LessonExercise({
  prompt,
  placeholder,
  value,
  onChange,
  onSave,
  saving,
}: {
  prompt: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const [savedFlash, setSavedFlash] = useState(false);

  const handleSave = () => {
    onSave();
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-ink">{prompt}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-lg border border-line bg-surface text-ink text-sm p-3 focus:outline-none focus:ring-2 focus:ring-brand transition-colors"
      />
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={handleSave}
          disabled={saving || value.trim().length === 0}
          className="text-sm"
        >
          {saving ? "Salvando..." : "Salvar resposta"}
        </Button>
        {savedFlash && (
          <span className="text-xs text-brand font-medium motion-safe:animate-fade-in">✓ Resposta salva</span>
        )}
      </div>
    </div>
  );
}
