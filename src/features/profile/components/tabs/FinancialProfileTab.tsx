import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Icon from "../../../../components/ui/Icon";
import ChipGroup from "../../../../components/ui/ChipGroup";
import { useFinancialProfile } from "../../hooks/useFinancialProfile";
import DebtsSection from "../DebtsSection";
import type { ExperienceLevel, FinancialPriority, IncomeRange } from "../../../../types/api";

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
];

const INCOME_OPTIONS: { value: IncomeRange; label: string }[] = [
  { value: "ate_2k", label: "Até R$ 2 mil" },
  { value: "2k_5k", label: "R$ 2 mil a R$ 5 mil" },
  { value: "5k_10k", label: "R$ 5 mil a R$ 10 mil" },
  { value: "10k_20k", label: "R$ 10 mil a R$ 20 mil" },
  { value: "acima_20k", label: "Acima de R$ 20 mil" },
];

const PRIORITY_OPTIONS: { value: FinancialPriority; label: string }[] = [
  { value: "reserva_emergencia", label: "Reserva de emergência" },
  { value: "quitar_dividas", label: "Quitar dívidas" },
  { value: "investir", label: "Investir" },
  { value: "comprar_um_bem", label: "Comprar um bem" },
  { value: "aposentadoria", label: "Aposentadoria" },
  { value: "educacao", label: "Educação" },
  { value: "organizar_financas", label: "Organizar finanças" },
  { value: "alcancar_objetivos", label: "Alcançar objetivos" },
  { value: "controlar_gastos", label: "Controlar gastos" },
  { value: "construir_patrimonio", label: "Construir patrimônio" },
];

export default function FinancialProfileTab() {
  const { profile, isLoading, save, isSaving } = useFinancialProfile();

  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [incomeRange, setIncomeRange] = useState<IncomeRange | null>(null);
  const [priorities, setPriorities] = useState<FinancialPriority[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (() => {
      if (!profile) return;
      setExperienceLevel(profile.experienceLevel);
      setIncomeRange(profile.incomeRange);
      setPriorities(profile.priorities);
    })();
  }, [profile]);

  const togglePriority = (value: FinancialPriority) => {
    setSaved(false);
    setPriorities((prev) => (prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]));
  };

  const handleSave = () => {
    save({ experienceLevel, incomeRange, priorities });
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card title="Seu perfil financeiro">
        {isLoading && <p className="text-sm text-ink-soft">Carregando...</p>}

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-medium text-ink mb-2">Experiência com finanças</p>
            <ChipGroup
              options={EXPERIENCE_OPTIONS}
              selected={experienceLevel ? [experienceLevel] : []}
              onToggle={(value) => {
                setExperienceLevel(value);
                setSaved(false);
              }}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-ink mb-2">Faixa de renda mensal</p>
            <ChipGroup
              options={INCOME_OPTIONS}
              selected={incomeRange ? [incomeRange] : []}
              onToggle={(value) => {
                setIncomeRange(value);
                setSaved(false);
              }}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-ink mb-2">Prioridades (escolha quantas fizerem sentido)</p>
            <ChipGroup options={PRIORITY_OPTIONS} selected={priorities} onToggle={togglePriority} />
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={isSaving} className="w-fit">
              {isSaving ? "Salvando..." : "Salvar perfil financeiro"}
            </Button>
            {saved && !isSaving && <span className="text-sm text-brand">Salvo.</span>}
          </div>
        </div>
      </Card>

      {profile?.behaviorProfile && (
        <Card title="Seu perfil comportamental">
          <p className="text-sm font-semibold text-brand-deep">{profile.behaviorProfile.label}</p>
          <p className="text-sm text-ink-soft mt-1">{profile.behaviorProfile.description}</p>
        </Card>
      )}

      <DebtsSection />

      {profile && profile.recommendations.length > 0 && (
        <Card title="Recomendações para você">
          <p className="text-sm text-ink-soft mb-4">
            Geradas a partir do seu perfil e dos seus dados reais na plataforma -- nunca por IA.
          </p>
          <ul className="flex flex-col gap-3">
            {profile.recommendations.map((rec) => (
              <li key={rec.id} className="flex items-center justify-between gap-4 rounded-xl border border-line p-4">
                <div>
                  <p className="text-sm font-semibold text-ink">{rec.title}</p>
                  <p className="text-xs text-ink-soft mt-1">{rec.description}</p>
                </div>
                <Link
                  to={rec.actionPath}
                  className="shrink-0 inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand-deep hover:bg-brand hover:text-white transition-colors"
                >
                  {rec.actionLabel}
                  <Icon name="arrowRight" size={13} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
