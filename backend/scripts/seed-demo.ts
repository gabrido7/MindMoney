/**
 * Cria contas de demonstração completas para o laboratório da apresentação.
 *
 * Cada conta passa só pela API pública (as mesmas regras de negócio do site):
 * cadastro, onboarding, perfil financeiro, 3 meses de transações, contas extras,
 * orçamentos por categoria (um estourado, para gerar alerta), objetivos com
 * aportes (um já concluído), dívidas (cartão parcelado e empréstimo com
 * pagamentos), ativos com histórico de valor, aulas concluídas e favoritos.
 * As datas são relativas a hoje, então os dados continuam "atuais".
 *
 * Uso (na pasta backend):
 *   npx tsx scripts/seed-demo.ts                         # API local
 *   API_URL=https://mindmoney-backend.onrender.com/api npx tsx scripts/seed-demo.ts
 * Opções: --count 25  --prefix lab  --domain mindmoney.demo  --out <arquivo>
 * A senha (uma só para todas) vem de DEMO_PASSWORD ou é gerada. A lista de
 * logins é salva em Downloads/contas-demonstracao.txt — nunca no repositório.
 * Contas que já existem são puladas, então rodar de novo é seguro.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fundamentosTrail } from "../../src/features/education/data/fundamentos";

const API = (process.env.API_URL ?? "http://localhost:3001/api").replace(/\/$/, "");
const arg = (name: string, fallback: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const COUNT = Number(arg("count", "25"));
const PREFIX = arg("prefix", "lab");
const DOMAIN = arg("domain", "mindmoney.demo");
const OUT = arg("out", path.join(os.homedir(), "Downloads", "contas-demonstracao.txt"));
const PASSWORD = process.env.DEMO_PASSWORD ?? `Demo-${crypto.randomBytes(4).toString("hex")}`;

// ---------- datas relativas a hoje ----------
const pad = (n: number) => String(n).padStart(2, "0");
const today = new Date();
const monthOf = (offset: number) => {
  const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  return { y: d.getFullYear(), m: d.getMonth() + 1, key: `${d.getFullYear()}-${pad(d.getMonth() + 1)}` };
};
const dateIn = (offset: number, day: number) => {
  const { y, m } = monthOf(offset);
  const last = new Date(y, m, 0).getDate();
  return `${y}-${pad(m)}-${pad(Math.min(day, last))}`;
};
const todayISO = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
const notFuture = (iso: string) => iso <= todayISO;

// ---------- aleatório reproduzível por conta ----------
function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}
const money = (v: number) => Math.round(v * 100) / 100;

// ---------- cliente HTTP ----------
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
async function call<T = any>(method: string, url: string, token?: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${url}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(90_000),
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new ApiError(res.status, `${method} ${url} → ${res.status}: ${data?.error?.message ?? text}`);
  return data as T;
}

// ---------- dados de uma conta ----------
function buildTransactions(r: () => number) {
  const salary = money(4200 + Math.floor(r() * 7) * 100); // 4.200 a 4.800
  const rent = money(850 + Math.floor(r() * 5) * 50);
  const rows: { date: string; description: string; category: string; subcategory?: string; type: "entrada" | "saida"; amount: number }[] = [];
  const add = (off: number, day: number, description: string, category: string, subcategory: string | undefined, type: "entrada" | "saida", base: number, jitter = 0.15) => {
    const date = dateIn(off, day);
    if (!notFuture(date)) return;
    rows.push({ date, description, category, subcategory, type, amount: money(base * (1 - jitter + r() * jitter * 2)) });
  };
  for (const off of [-2, -1, 0]) {
    add(off, 5, "Salário", "Salário", undefined, "entrada", salary, 0);
    add(off, 6, "Aluguel do apartamento", "Moradia", "Aluguel", "saida", rent, 0);
    add(off, 8, "Compra do mês no mercado", "Alimentação", "Mercado", "saida", 480);
    add(off, 10, "Conta de luz", "Moradia", "Energia", "saida", 135);
    add(off, 10, "Internet fibra", "Moradia", "Internet", "saida", 99.9, 0);
    add(off, 12, "Mensalidade da academia", "Saúde", "Academia", "saida", 89.9, 0);
    add(off, 14, "Streaming de filmes e séries", "Lazer", "Streaming", "saida", 39.9, 0);
    add(off, 15, "Recarga do cartão de ônibus", "Transporte", "Transporte Público", "saida", 120, 0);
    add(off, 17, "Pizza no fim de semana", "Alimentação", "Delivery", "saida", 65);
    add(off, 19, "Uber para o trabalho", "Transporte", "Uber", "saida", 28);
    add(off, 21, "Almoço no restaurante", "Alimentação", "Restaurante", "saida", 45);
    add(off, 24, "Farmácia", "Saúde", "Farmácia", "saida", 35);
  }
  add(-2, 22, "Tênis novo", "Compras", undefined, "saida", 230);
  add(-2, 27, "Freela de design", "Outros", undefined, "entrada", 450);
  add(-1, 25, "Cinema com amigos", "Lazer", "Cinema", "saida", 54);
  add(-1, 26, "Livro de finanças", "Educação", "Livros", "saida", 49.9, 0);
  add(0, 12, "Curso online de inglês", "Educação", "Curso", "saida", 79.9, 0);
  add(0, 16, "Show no fim de semana", "Lazer", "Eventos", "saida", 180); // estoura o orçamento de Lazer
  add(0, 18, "Lanche da tarde", "Alimentação", "Lanche", "saida", 19);
  return rows;
}

async function seedAccount(n: number) {
  const r = rng(n);
  const email = `${PREFIX}${pad(n)}@${DOMAIN}`;
  const name = `Demonstração ${pad(n)}`;

  let auth: { token: string };
  try {
    auth = await call("POST", "/auth/register", undefined, { name, email, password: PASSWORD });
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) return { email, status: "já existia (pulada)" };
    throw err;
  }
  const t = auth.token;

  // Onboarding + perfil financeiro (sem isso o site manda para /onboarding)
  await call("PUT", "/users/me/financial-profile", t, {
    experienceLevel: "iniciante",
    financialSituation: "aperta_mas_consigo",
    incomeRange: "2k_5k",
    incomeVariable: false,
    incomeSources: ["Salário", "Freelas"],
    priorities: ["reserva_emergencia", "quitar_dividas", "investir"],
    habits: { tracksSpending: "as_vezes", overspends: "as_vezes", creditCardUsage: "pouco", investsRegularly: "as_vezes" },
  });
  await call("PUT", "/users/me/onboarding", t, { skippedSteps: [] });

  // Contas/carteiras extras
  await call("POST", "/accounts", t, { type: "poupanca", name: "Poupança", initialBalance: money(1500 + r() * 1500) });
  const wallet = await call("POST", "/accounts", t, { type: "carteira", name: "Carteira", initialBalance: 120 });


  const { categories }: { categories: { id: number; name: string }[] } = await call("GET", "/categories", t);
  const cat = (nome: string) => {
    const c = categories.find((x) => x.name === nome);
    if (!c) throw new Error(`categoria "${nome}" não encontrada`);
    return c.id;
  };
  // Orçamentos do mês atual ANTES das transações: a importação é que dispara
  // os alertas, e Lazer estoura de propósito (show no fim de semana).
  const month = monthOf(0).key;
  await call("PUT", `/category-budgets/${cat("Alimentação")}`, t, { month, amount: 900 });
  await call("PUT", `/category-budgets/${cat("Transporte")}`, t, { month, amount: 250 });
  await call("PUT", `/category-budgets/${cat("Lazer")}`, t, { month, amount: 150 });

  // Transações de 3 meses (na conta principal)
  await call("POST", "/transactions/import", t, { transactions: buildTransactions(r) });

  const walletId = wallet.id ?? wallet.account?.id;
  if (walletId && notFuture(dateIn(0, 3))) {
    await call("POST", "/transactions", t, {
      accountId: walletId, categoryId: cat("Alimentação"), description: "Pão de queijo e café",
      amount: 14.5, type: "saida", transactionDate: dateIn(0, 3),
    });
  }


  // Objetivos com aportes (o do fone já é concluído → comemoração)
  const objectives = [
    { name: "Reserva de emergência", category: "reserva", priority: "alta", targetAmount: 5000, offset: 12, aportes: [400, 350, 300] },
    { name: "Viagem de férias", category: "viagem", priority: "media", targetAmount: 2500, offset: 10, aportes: [250, 300] },
    { name: "Notebook novo", category: "compra", priority: "baixa", targetAmount: 3500, offset: 18, aportes: [200] },
    { name: "Fone de ouvido", category: "compra", priority: "media", targetAmount: 300, offset: 2, aportes: [150, 150] },
  ];
  for (const o of objectives) {
    const created = await call("POST", "/objectives", t, {
      name: o.name, category: o.category, priority: o.priority, targetAmount: o.targetAmount, targetMonth: monthOf(o.offset).key,
    });
    const id = created.id ?? created.objective?.id;
    for (let i = 0; i < o.aportes.length; i++) {
      const when = dateIn(-(o.aportes.length - 1 - i), 7);
      if (notFuture(when)) await call("POST", `/objectives/${id}/contributions`, t, { amount: o.aportes[i], contributedAt: when });
    }
  }

  // Dívidas: cartão parcelado (gera as parcelas) e empréstimo com pagamentos
  await call("POST", "/debts", t, {
    type: "cartao_credito", name: "Celular parcelado no cartão", totalAmount: 1800,
    installmentAmount: 150, installmentsCount: 12, interestRate: 0, dueDay: 10, autoGenerateInstallments: true,
  });
  const loan = await call("POST", "/debts", t, {
    type: "emprestimo", name: "Empréstimo pessoal", totalAmount: 3000,
    installmentAmount: 290, installmentsCount: 12, interestRate: 2.5, dueDay: 28,
  });
  const loanId = loan.id ?? loan.debt?.id;
  for (const off of [-2, -1]) await call("POST", `/debts/${loanId}/payments`, t, { amount: 290, paidAt: dateIn(off, 28) });

  // Ativos com histórico de valor (patrimônio líquido)
  const tesouro = await call("POST", "/assets", t, { type: "investimento", name: "Tesouro Selic", initialValue: 2000, valuedAt: dateIn(-2, 1) });
  const tesouroId = tesouro.id ?? tesouro.asset?.id;
  await call("POST", `/assets/${tesouroId}/updates`, t, { value: 2330, valuedAt: dateIn(-1, 1) });
  await call("POST", `/assets/${tesouroId}/updates`, t, { value: 2740, valuedAt: dateIn(0, 1) });
  await call("POST", "/assets", t, { type: "veiculo", name: "Moto", initialValue: 9000, valuedAt: dateIn(-2, 1) });

  // Educação financeira: primeiras aulas concluídas (gera XP e conquistas)
  const lessons = fundamentosTrail.courses.flatMap((c) => c.lessons).filter((l) => l.content);
  for (const lesson of lessons.slice(0, 5)) {
    const total = lesson.content!.quiz.length;
    await call("PUT", `/education/progress/${encodeURIComponent(lesson.id)}`, t, {
      completed: true, quizScore: Math.max(0, total - Math.floor(r() * 2)), quizTotal: total,
    });
  }

  // Favoritos: uma aula e duas calculadoras
  if (lessons[5]) await call("POST", "/favorites", t, { contentType: "lesson", contentId: lessons[5].id });
  await call("POST", "/favorites", t, { contentType: "tool", contentId: "juros-compostos" });
  await call("POST", "/favorites", t, { contentType: "tool", contentId: "reserva-de-emergencia" });

  return { email, status: "criada" };
}

async function main() {
  console.log(`API: ${API}`);
  console.log(`Criando ${COUNT} contas (${PREFIX}01..${PREFIX}${pad(COUNT)}@${DOMAIN})...\n`);
  const results: { email: string; status: string }[] = [];
  for (let n = 1; n <= COUNT; n++) {
    try {
      const res = await seedAccount(n);
      results.push(res);
      console.log(`  ${res.email}  ${res.status}`);
    } catch (err) {
      const email = `${PREFIX}${pad(n)}@${DOMAIN}`;
      results.push({ email, status: `ERRO: ${(err as Error).message}` });
      console.log(`  ${email}  ERRO: ${(err as Error).message}`);
    }
  }

  const created = results.filter((r) => r.status === "criada").length;
  const lines = [
    "MINDMONEY — CONTAS DE DEMONSTRAÇÃO",
    `Site: https://mindmoney-frontend.vercel.app`,
    `Senha (igual para todas as contas criadas nesta execução): ${PASSWORD}`,
    "",
    ...results.map((r, i) => `${pad(i + 1)}. ${r.email.padEnd(28)} ${r.status}`),
    "",
    "Contas que \"já existiam\" mantêm a senha da execução em que foram criadas.",
  ];
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, lines.join("\n"), "utf8");
  console.log(`\n${created} criadas, ${results.length - created} não criadas. Lista salva em: ${OUT}`);
  if (results.some((r) => r.status.startsWith("ERRO"))) process.exitCode = 1;
}

main();
