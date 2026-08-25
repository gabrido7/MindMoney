import { Link } from "react-router-dom";
import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Icon from "../../../../components/ui/Icon";

const FACTS = [
  "Sua senha é armazenada só como hash (bcrypt), nunca em texto puro -- nem quem tem acesso ao banco consegue ler a senha original.",
  "Todas as consultas ao banco são isoladas por conta: ninguém mais consegue ver, editar ou apagar suas transações, metas ou objetivos.",
  "Não há integração com nenhuma IA/LLM externa. Score, insights e recomendações são calculados por regras determinísticas, direto sobre seus dados reais.",
  "Não coletamos endereço IP nem geolocalização -- a lista de sessões ativas guarda só o navegador/sistema, o suficiente para você reconhecer qual dispositivo é qual.",
  "Seus dados nunca são vendidos nem compartilhados com terceiros. O Mind Money não tem publicidade nem parceiros de dados.",
];

export default function PrivacyTab() {
  return (
    <div className="flex flex-col gap-6">
      <Card title="Como seus dados são tratados">
        <ul className="flex flex-col gap-3">
          {FACTS.map((fact) => (
            <li key={fact} className="flex items-start gap-3 text-sm text-ink">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-deep">
                <Icon name="check" size={12} />
              </span>
              {fact}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Seus dados, exportáveis">
        <p className="text-sm text-ink-soft mb-4">
          Você pode baixar uma cópia completa das suas transações, categorias e metas a qualquer momento, em JSON
          ou CSV -- pelo painel de "Exportar / Importar" no Dashboard.
        </p>
        <Link to="/dashboard">
          <Button variant="secondary" className="w-fit">
            <Icon name="download" size={15} />
            Ir para exportação de dados
          </Button>
        </Link>
      </Card>
    </div>
  );
}
