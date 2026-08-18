import { useState } from "react";
import Icon from "../../../components/ui/Icon";

const FAQS = [
  {
    question: "Meus dados financeiros ficam seguros?",
    answer:
      "Sim. Sua senha é armazenada com hash bcrypt (nunca em texto puro), o acesso à API exige autenticação por token e todas as consultas ao banco são isoladas por usuário — ninguém mais consegue ver ou alterar suas transações.",
  },
  {
    question: "O Mind Money usa inteligência artificial para analisar meus gastos?",
    answer:
      "O score financeiro, os relatórios e as recomendações são calculados por regras determinísticas em cima dos seus próprios dados — não há integração com IA/LLM no momento, e preferimos deixar isso claro em vez de fingir uma funcionalidade que não existe.",
  },
  {
    question: "Preciso pagar alguma coisa para usar?",
    answer:
      "Não. A criação de conta e todas as funcionalidades descritas nesta página são gratuitas.",
  },
  {
    question: "Posso apagar minha conta e meus dados?",
    answer:
      "Sim, o encerramento de conta remove seus dados do banco de forma definitiva, respeitando a ordem correta de exclusão entre transações e cadastro.",
  },
  {
    question: "Consigo acessar pelo celular?",
    answer:
      "Sim, a plataforma é responsiva e funciona tanto em desktop quanto em celular e tablet, direto pelo navegador.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-4 py-20 md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-green-400">
            <Icon name="shield" size={14} />
            Dúvidas frequentes
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Perguntas frequentes</h2>
        </div>

        <div className="mt-10 flex flex-col divide-y divide-white/10 rounded-2xl border border-white/10 bg-neutral-900/50">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-white sm:text-base">
                    {faq.question}
                  </span>
                  <Icon
                    name="chevronDown"
                    size={18}
                    className={`shrink-0 text-green-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <p className="px-6 pb-5 text-sm leading-relaxed text-neutral-400">{faq.answer}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
