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
      <p className="text-sm text-gray-700 dark:text-gray-200">{prompt}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
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
          <span className="text-xs text-[#0ca30c] font-medium motion-safe:animate-fade-in">✓ Resposta salva</span>
        )}
      </div>
    </div>
  );
}
