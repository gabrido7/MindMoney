import Card from "../../../../components/ui/Card";
import Switch from "../../../../components/ui/Switch";
import { useAppearance } from "../../../../hooks/useAppearance";
import type { Density, FontSize, ThemePreference } from "../../../../contexts/appearance-context";

function OptionPill<T extends string>({
  value,
  current,
  label,
  onSelect,
}: {
  value: T;
  current: T;
  label: string;
  onSelect: (value: T) => void;
}) {
  const active = value === current;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active ? "bg-brand text-white" : "border border-line text-ink-soft hover:border-brand hover:text-brand-deep"
      }`}
    >
      {label}
    </button>
  );
}

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
  { value: "system", label: "Sistema" },
];

const DENSITY_OPTIONS: { value: Density; label: string }[] = [
  { value: "comfortable", label: "Confortável" },
  { value: "compact", label: "Compacta" },
];

const FONT_SIZE_OPTIONS: { value: FontSize; label: string }[] = [
  { value: "small", label: "Pequena" },
  { value: "medium", label: "Média" },
  { value: "large", label: "Grande" },
];

export default function AppearanceTab() {
  const {
    theme,
    setTheme,
    density,
    setDensity,
    animationsEnabled,
    setAnimationsEnabled,
    achievementEffectsEnabled,
    setAchievementEffectsEnabled,
    fontSize,
    setFontSize,
  } = useAppearance();

  return (
    <div className="flex flex-col gap-6">
      <Card title="Tema">
        <div className="flex flex-wrap gap-2">
          {THEME_OPTIONS.map((opt) => (
            <OptionPill key={opt.value} value={opt.value} current={theme} label={opt.label} onSelect={setTheme} />
          ))}
        </div>
      </Card>

      <Card title="Densidade da interface">
        <p className="text-sm text-ink-soft mb-3">Controla o respiro interno dos cartões em toda a plataforma.</p>
        <div className="flex flex-wrap gap-2">
          {DENSITY_OPTIONS.map((opt) => (
            <OptionPill key={opt.value} value={opt.value} current={density} label={opt.label} onSelect={setDensity} />
          ))}
        </div>
      </Card>

      <Card title="Tamanho da fonte">
        <div className="flex flex-wrap gap-2">
          {FONT_SIZE_OPTIONS.map((opt) => (
            <OptionPill key={opt.value} value={opt.value} current={fontSize} label={opt.label} onSelect={setFontSize} />
          ))}
        </div>
      </Card>

      <Card title="Movimento e efeitos">
        <ul className="flex flex-col divide-y divide-line">
          <li className="flex items-center justify-between gap-4 py-4 first:pt-0">
            <div>
              <p className="text-sm font-medium text-ink">Animações</p>
              <p className="text-xs text-ink-soft mt-0.5">
                Transições e reveals ao rolar a página. Desligar aqui vale mesmo se o seu sistema não pedir
                movimento reduzido.
              </p>
            </div>
            <Switch checked={animationsEnabled} onChange={setAnimationsEnabled} label="Animações" />
          </li>
          <li className="flex items-center justify-between gap-4 py-4 last:pb-0">
            <div>
              <p className="text-sm font-medium text-ink">Efeitos visuais de conquistas</p>
              <p className="text-xs text-ink-soft mt-0.5">
                O pulso verde ao bater uma meta ou objetivo. As outras animações continuam normais.
              </p>
            </div>
            <Switch
              checked={achievementEffectsEnabled}
              onChange={setAchievementEffectsEnabled}
              label="Efeitos de conquistas"
            />
          </li>
        </ul>
      </Card>
    </div>
  );
}
