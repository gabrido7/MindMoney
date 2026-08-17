import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/* ================= FORMATADOR ================= */

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const calcPercentChange = (current: number, previous: number) => {
    if (previous === 0 && current > 0) return 100;
    if (previous === 0 && current === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

/* ================= SUBCATEGORIAS ================= */

const subcategoriesMap: Record<string, string[]> = {
  Alimentação: ["Mercado", "Restaurante", "Delivery", "Lanche"],

  Transporte: ["Combustível", "Uber", "Manutenção", "Transporte Público", "Estacionamento"],

  Moradia: ["Aluguel", "Financiamento", "Condomínio", "Energia", "Água", "Internet"],

  Lazer: ["Cinema", "Viagem", "Streaming", "Jogos", "Eventos"],

  Saúde: ["Farmácia", "Consulta", "Exames", "Academia", "Convênio", "Luta"],

  Educação: ["Curso", "Faculdade", "Livros", "Material"],

  Investimento: ["Criptomoeda", "FII", "Ações", "Renda Fixa", "Tesouro Direto"],

  Compras: ["Roupas", "Eletrônicos", "Casa", "Presentes"],

  Assinaturas: ["Netflix", "Spotify", "Amazon"],

};

/* ================= TIPAGEM ================= */

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "entrada" | "saida";
  date: string;
  category: string;
  subcategory?: string;
}

/* ================= COMPONENTE ================= */

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"entrada" | "saida">("entrada");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Salário");
  const [subcategory, setSubcategory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const getPreviousMonth = (month: string) => {
    const date = new Date(month + "-01");
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().slice(0, 7);
  };
  
  const previousMonth = getPreviousMonth(selectedMonth);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const alertPercent = 70; // valor fixo padrão

  const [savingGoal, setSavingGoal] = useState<number>(() => {
    const saved = localStorage.getItem("savingGoal");
    return saved ? Number(saved) : 0;
  });

  /* ================= AUTO DEFINIÇÃO DE TIPO ================= */

  useEffect(() => {
    if (category === "Salário") setType("entrada");

    if (
      category === "Alimentação" ||
      category === "Transporte" ||
      category === "Moradia" ||
      category === "Lazer" ||
      category === "Saúde" ||
      category === "Educação" ||
      category === "Investimento" ||
      category === "Compras" ||
      category === "Assinaturas"
    ) {
      setType("saida");
    }
  }, [category]);

  /* ================= LOCAL STORAGE ================= */

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("savingGoal", String(savingGoal));
  }, [savingGoal]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* ================= CRUD ================= */

  const handleAddOrEdit = () => {
    if (!amount || !date || !category) {
      setErrorMessage("Preencha todos os campos obrigatórios.");
      return;
    }

    const numericAmount = Number(amount);

    if (numericAmount <= 0) {
      setErrorMessage("O valor deve ser maior que zero.");
      return;
    }

    setErrorMessage("");

    const finalDescription =
      category === "Outros" ? description : category;

    if (editingId !== null) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? {
                ...t,
                description: finalDescription,
                amount: numericAmount,
                type,
                date,
                category,
                subcategory,
              }
            : t
        )
      );
      setEditingId(null);
    } else {
      const newTransaction: Transaction = {
        id: Date.now(),
        description: finalDescription,
        amount: numericAmount,
        type,
        date,
        category,
        subcategory: subcategory || undefined,
      };

      setTransactions([...transactions, newTransaction]);
    }

    setDescription("");
    setAmount("");
    setDate("");
    setCategory("Salário");
    setSubcategory("");
  };

  const handleEdit = (transaction: Transaction) => {
    setDescription(
      transaction.category === "Outros" ? transaction.description : ""
    );
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    setDate(transaction.date);
    setCategory(transaction.category);
    setSubcategory(transaction.subcategory || "");
    setEditingId(transaction.id);
  };

  const handleDelete = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  /* ================= FILTRO ================= */

  const filteredTransactions = transactions.filter((t) =>
    t.date.startsWith(selectedMonth)
  );

  const totalEntradas = filteredTransactions
    .filter((t) => t.type === "entrada")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSaidas = filteredTransactions
    .filter((t) => t.type === "saida")
    .reduce((acc, t) => acc + t.amount, 0);

  const saldo = totalEntradas - totalSaidas;

  const previousTransactions = transactions.filter(
    (t) => t.date && t.date.startsWith(previousMonth)
  );
    
  const prevEntradas = previousTransactions
  .filter((t) => t.type === "entrada")
  .reduce((acc, t) => acc + t.amount, 0);

const prevSaidas = previousTransactions
  .filter((t) => t.type === "saida")
  .reduce((acc, t) => acc + t.amount, 0);

const prevSaldo = prevEntradas - prevSaidas;

const entradasChange = calcPercentChange(totalEntradas || 0, prevEntradas || 0);
const saidasChange = calcPercentChange(totalSaidas || 0, prevSaidas || 0);
const saldoChange = calcPercentChange(saldo || 0, prevSaldo || 0);


  /* ================= EVOLUÇÃO FINANCEIRA ================= */

const monthlyData = transactions.reduce((acc: any, t) => {
  const month = t.date.slice(0, 7); // yyyy-mm

  if (!acc[month]) {
    acc[month] = { month, entradas: 0, saidas: 0 };
  }

  if (t.type === "entrada") acc[month].entradas += t.amount;
  else acc[month].saidas += t.amount;

  return acc;
}, {});

const evolutionData = Object.values(monthlyData)
  .map((m: any) => ({
    month: m.month,
    saldo: m.entradas - m.saidas,
  }))
  .sort((a: any, b: any) => a.month.localeCompare(b.month));


  const gastoPercentual =
    totalEntradas > 0 ? (totalSaidas / totalEntradas) * 100 : 0;

  const ultrapassouLimite =
    totalEntradas > 0 && gastoPercentual > alertPercent;
   
  const quaseNoLimite =
  totalEntradas > 0 &&
  gastoPercentual >= alertPercent * 0.8 &&
  gastoPercentual < alertPercent;

  const savingPercent =
    savingGoal > 0 ? (saldo / savingGoal) * 100 : 0;

  const getSuggestion = () => {
      if (ultrapassouLimite) {
        const biggestCategory = categoryData.sort(
          (a, b) => b.value - a.value
        )[0];
        

    
        if (!biggestCategory) return "Revise seus gastos.";
    
        return `Você ultrapassou o limite. Sua maior despesa foi em ${biggestCategory.name}. Considere reduzir essa categoria.`;
      }
    
      if (quaseNoLimite) {
        return "Atenção: seus gastos estão se aproximando do limite. Evite despesas desnecessárias.";
      }
    
      return null;
  };

  /* ================= GRÁFICO PRINCIPAL ================= */

  const categoryData = filteredTransactions
    .filter((t) => t.type === "saida")
    .reduce((acc: { name: string; value: number }[], transaction) => {
      const existing = acc.find(
        (item) => item.name === transaction.category
      );

      if (existing) {
        existing.value += transaction.amount;
      } else {
        acc.push({
          name: transaction.category,
          value: transaction.amount,
        });
      }

      return acc;
    }, []);

    const totalGeral = categoryData.reduce((acc, item) => acc + item.value, 0);

    
  const groupByCategory = (data: Transaction[]) => {
    return data
      .filter((t) => t.type === "saida")
      .reduce((acc: Record<string, number>, t) => {
        if (!acc[t.category]) acc[t.category] = 0;
        acc[t.category] += t.amount;
        return acc;
      }, {});
  };

  const currentByCategory = groupByCategory(filteredTransactions);
  const previousByCategory = groupByCategory(previousTransactions);

  const categoryComparison = Object.keys(currentByCategory).map((cat) => {
  const current = currentByCategory[cat] || 0;
  const previous = previousByCategory[cat] || 0;

  return {
    category: cat,
    change: calcPercentChange(current, previous),
    current,
    previous,
  };
});

    // 🔥 MAIOR AUMENTO 
const biggestIncrease = categoryComparison
  .filter((c) => c.change > 0)
  .sort((a, b) => b.change - a.change)[0];

// 🔵 MAIOR REDUÇÃO
const biggestDecrease = categoryComparison
  .filter((c) => c.change < 0)
  .sort((a, b) => a.change - b.change)[0];

// 🟣 TOP 3 AUMENTOS
const top3Increases = categoryComparison
  .filter((c) => c.change > 0)
  .sort((a, b) => b.change - a.change)
  .slice(0, 3);

// 🔴 SUGESTÃO INTELIGENTE
const generateSuggestion = () => {
  if (!biggestIncrease) return null;

  const cat = biggestIncrease.category;

  if (cat === "Alimentação") {
    return "Considere reduzir gastos com delivery ou refeições fora.";
  }

  if (cat === "Lazer") {
    return "Avalie diminuir gastos com entretenimento este mês.";
  }

  if (cat === "Transporte") {
    return "Tente otimizar gastos com combustível ou transporte.";
  }

  if (cat === "Investimento") {
    return "Você aumentou seus investimentos. Ótimo sinal financeiro!";
  }

  return "Revise seus gastos para manter o controle financeiro.";
};

const suggestion = generateSuggestion();



    const rankingGastos = [...categoryData]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: "#f97316",
  Transporte: "#3b82f6",
  Moradia: "#ef4444",
  Lazer: "#a855f7",
  Saúde: "#10b981",
  Educação: "#6366f1",
  Investimento: "#eab308",
  Compras: "#ec4899",
  Assinaturas: "#59d8ff",
  Outros: "#6b7280",
};

  const SUBCATEGORY_COLORS: Record<string, string> = {
  // Alimentação
  Mercado: "#f97316",
  Restaurante: "#fb923c",
  Delivery: "#fdba74",
  Lanche: "#fed7aa",

  // Transporte
  Combustível: "#3b82f6",
  Uber: "#60a5fa",
  Manutenção: "#93c5fd",

  // Moradia
  Aluguel: "#ed4a4a",
  Financiamento: "#e84f4f",
  Condomínio: "#e35454",
  Energia: "#e35b5b",
  Água: "#e06060",
  Internet: "#d96868",

  // Lazer
  Cinema: "#a854f7",
  Viagem: "#c084fc",
  Streaming: "#ce9dfc",
  Jogos: "#9c39fa",
  Eventos: "#cc9ef7",

  // Saúde
  Farmácia: "#04b579",
  Consulta: "#22b382",
  Exames: "#16b580",
  Academia: "#3dba90",
  Convênio: "#62b599",
  Luta: "#72b39c",
  
  // Educação
  Curso: "#7173f0",
  Faculdade: "#8082ed",
  Livros: "#8f91eb",
  Material: "#9d9feb",

  // Investimento
  Criptomoeda: "#eab308",
  FII: "#facc15",
  Ações: "#fde047",
  "Renda Fixa": "#fef08a",
  "Tesouro Direto": "#fff5a6",

  // Compras
  Roupas: "#e864a5",
  Eletrônicos: "#e675ac",
  Casa: "#e386b3",
  Presentes: "#e39abd",

  // Assinaturas
  Netflix: "#73deff",
  Spotify: "#87e3ff",
  Amazon: "#9ee8ff",

  // fallback
  Outros: "#6b7280",
};

  const detailedData =
    selectedCategory &&
    filteredTransactions
      .filter((t) => t.category === selectedCategory)
      .reduce((acc: Record<string, number>, curr) => {
        const key = curr.subcategory || "Outros";
        if (!acc[key]) acc[key] = 0;
        acc[key] += curr.amount;
        return acc;
      }, {});

  const detailedChartData =
    detailedData &&
    Object.entries(detailedData).map(([name, value]) => ({
      name,
      value,
    }));

  /* ================= JSX COMPLETO ================= */

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">
          Dashboard Financeiro
        </h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white"
        >
          {darkMode ? "Modo Claro ☀️" : "Modo Escuro 🌙"}
        </button>
      </div>

      {/* FILTRO MÊS */}
      <div className="mb-6">
        <label className="mr-2 font-medium dark:text-white">
          Filtrar por mês:
        </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* META INTELIGENTE */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4 dark:text-white">
          Meta de Economia Mensal
        </h2>

        <div className="flex gap-4 items-center mb-4">
          <input
            type="number"
            placeholder="Definir meta (R$)"
            value={savingGoal}
            onChange={(e) => setSavingGoal(Number(e.target.value))}
            className="p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
          />
          <span className="text-gray-500 dark:text-gray-400">
            Meta atual: R$ {savingGoal.toFixed(2)}
          </span>
        </div>

        {savingGoal > 0 && (
          <>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
              <div
                className={`h-4 rounded-full ${
                  savingPercent >= 100
                    ? "bg-green-600"
                    : savingPercent >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${Math.min(savingPercent, 100)}%` }}
              />
            </div>

            <p className="dark:text-white">
              Progresso: {savingPercent.toFixed(1)}%
            </p>

            {savingPercent >= 100 && (
              <p className="text-green-600 font-semibold">
                🏆 Meta atingida!
              </p>
            )}

            {savingPercent < 100 && saldo > 0 && (
              <p className="text-yellow-600">
                Faltam R$ {(savingGoal - saldo).toFixed(2)} para atingir sua meta.
              </p>
            )}

            {saldo <= 0 && (
              <p className="text-red-600">
                Você precisa reduzir gastos para atingir sua meta.
              </p>
            )}
          </>
        )}
      </div>

      {/* ALERTA GASTOS */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2 dark:text-white">
          Alerta de Gastos
        </h2>

        <p className="text-gray-500 dark:text-gray-400">
          O sistema alerta automaticamente quando seus gastos ultrapassam {""}
          <span className="font-bold text-red-500">{alertPercent}%</span>  das suas entradas.
        </p>
      </div>

      {(ultrapassouLimite || quaseNoLimite) && (
        <div
          className={`mb-6 p-4 rounded-xl shadow text-white ${
            ultrapassouLimite
              ? "bg-red-500 animate-pulse"
              : "bg-yellow-500"
          }`}
        >
          <p className="font-semibold">
            {ultrapassouLimite
              ? "🚨 Limite ultrapassado!"
              : "⚠️ Você está próximo do limite!"}
          </p>

          <p>
            Você utilizou {gastoPercentual.toFixed(1)}% das suas entradas.
          </p>

          <p className="mt-2 text-sm">
            💡 {getSuggestion()}
          </p>
        </div>
      )}

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Entradas" value={totalEntradas} color="green" />
        <Card title="Saídas" value={totalSaidas} color="red" />

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-gray-500 dark:text-gray-300">Saldo</h2>
          <p className={`text-2xl font-bold ${saldo >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(saldo)}
          </p>
        </div>
      </div>

{/* RANKING + COMPARAÇÃO + INSIGHTS */}
<div className="grid md:grid-cols-2 gap-6 mb-8">

  {/* RANKING */}
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
    <h2 className="text-xl font-semibold mb-4 dark:text-white">
      Ranking de Gastos
    </h2>

    {rankingGastos.length > 0 ? (
      <ul className="space-y-3">
        {rankingGastos.map((item, index) => (
          <li key={index} className="flex justify-between">
            <span className="dark:text-white">
              {index === 0 && "🥇"}
              {index === 1 && "🥈"}
              {index === 2 && "🥉"} {item.name}
            </span>

            <span className="text-red-500 font-bold">
              {formatCurrency(item.value)}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">Sem dados</p>
    )}
  </div>

  {/* COMPARAÇÃO */}
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
    <h2 className="text-xl font-semibold mb-4 dark:text-white">
      Comparação com mês anterior
    </h2>

    <div className="space-y-2 dark:text-white">
      <p>
        Entradas: {entradasChange.toFixed(1)}%{" "}
        {entradasChange >= 0 ? "📈" : "📉"}
      </p>

      <p>
        Saídas: {saidasChange.toFixed(1)}%{" "}
        {saidasChange >= 0 ? "📈" : "📉"}
      </p>

      <p>
        Saldo: {saldoChange.toFixed(1)}%{" "}
        {saldoChange >= 0 ? "📈" : "📉"}
      </p>
    </div>
  </div>

</div>

{/* INSIGHTS */}
<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
  <h2 className="text-xl font-semibold mb-4 dark:text-white">
    Insights Inteligentes
  </h2>

  {biggestIncrease && (
    <p className="dark:text-white mb-2">
      📈 Maior aumento:{" "}
      <span className="text-red-500 font-bold">
        {biggestIncrease.category}
      </span>{" "}
      ({biggestIncrease.change.toFixed(1)}%)
    </p>
  )}

  {biggestDecrease && (
    <p className="dark:text-white mb-2">
      📉 Maior redução:{" "}
      <span className="text-green-500 font-bold">
        {biggestDecrease.category}
      </span>{" "}
      ({Math.abs(biggestDecrease.change).toFixed(1)}%)
    </p>
  )}

  {top3Increases.length > 0 && (
    <div className="mt-4">
      <p className="font-semibold dark:text-white mb-2">
        🔝 Top 3 aumentos:
      </p>

      <ul className="list-disc ml-5 dark:text-white">
        {top3Increases.map((item, index) => (
          <li key={index}>
            {item.category} ({item.change.toFixed(1)}%)
          </li>
        ))}
      </ul>
    </div>
  )}

  {suggestion && (
    <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
      💡 {suggestion}
    </div>
  )}
</div>

      {/* EVOLUÇÃO FINANCEIRA */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Evolução Financeira
        </h2>

        {evolutionData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="month"
                tickFormatter={(m) =>
                  m.split("-").reverse().join("/")
                }
              />

              <YAxis />

              <Tooltip
                formatter={(value: any, name: any) => {
                  const numericValue = Number(value) || 0;
                  const percent =
                    totalGeral > 0 ? (numericValue / totalGeral) * 100 : 0;

                  return [
                    `${formatCurrency(numericValue)} (${percent.toFixed(1)}%)`,
                    name,
                  ];
                }}
              />

              <Line
                type="monotone"
                dataKey="saldo"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Ainda não há dados suficientes.
          </p>
        )}
      </div>


      {/* GRÁFICO PRINCIPAL */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Distribuição por Categoria
        </h2>

        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              outerRadius={100}
              label={({ name, value }) => {
                const percent = totalGeral > 0 ? (value / totalGeral) * 100 : 0;
                return `${name} (${percent.toFixed(1)}%)`;
              }}
                onClick={(data: any) =>
                  setSelectedCategory(data.name)
                }
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      CATEGORY_COLORS[entry.name] || "#94a3b8"
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma saída no mês.
          </p>
        )}
      </div>

      {/* DETALHAMENTO */}
      {selectedCategory && detailedChartData && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Detalhamento de {selectedCategory}
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={detailedChartData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {detailedChartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={SUBCATEGORY_COLORS[entry.name] || "#94a3b8"
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <button
            onClick={() => setSelectedCategory(null)}
            className="mt-4 text-blue-600"
          >
            Fechar detalhamento
          </button>
        </div>
      )}

      {/* NOVA TRANSAÇÃO */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Nova Transação
        </h2>

        {errorMessage && (
          <p className="text-red-500 text-sm font-medium">
            {errorMessage}
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
        >
          <option>Salário</option>
          <option>Alimentação</option>
          <option>Transporte</option>
          <option>Moradia</option>
          <option>Lazer</option>
          <option>Saúde</option>
          <option>Educação</option>
          <option>Investimento</option>
          <option>Compras</option>
          <option>Assinaturas</option>
          <option>Outros</option>
        </select>

          {category === "Outros" && (
            <input
              type="text"
              placeholder="Descrição"
              className="flex-1 p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          )}

          <input
            type="number"
            placeholder="Valor"
            className="flex-1 p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            type="date"
            className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <select
            value={type}
            disabled={
              category !== "Outros"
            }
            onChange={(e) =>
              setType(e.target.value as "entrada" | "saida")
            }
            className="border p-3 rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>

          {subcategoriesMap[category] && (
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="p-3 rounded-lg border dark:bg-gray-700 dark:text-white"
            >
              <option value="">Selecione</option>
              {subcategoriesMap[category].map((sub) => (
                <option key={sub}>{sub}</option>
              ))}
            </select>
          )}

          <button
            onClick={handleAddOrEdit}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {editingId !== null ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>

      {/* LISTA */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Transações
        </h2>

        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma transação neste mês.
          </p>
        ) : (
          <ul className="space-y-3">
            {filteredTransactions.map((t) => (
              <li
                key={t.id}
                className="flex justify-between items-center border-b pb-2 dark:border-gray-600"
              >
                <div>
                  <p className="font-medium dark:text-white">
                    {t.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t.date.split("-").reverse().join("/")}
                  </p>
                  <p className="text-sm text-gray-400">
                    Categoria: {t.category}
                  </p>
                  {t.subcategory && (
                    <p className="text-sm text-gray-400">
                      Subcategoria: {t.subcategory}
                    </p>
                  )}
                  <p
                    className={
                      t.type === "entrada"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {formatCurrency(t.amount)}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(t)}
                    className="text-blue-500 hover:underline"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-red-500 hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ================= CARD ================= */

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="text-gray-500 dark:text-gray-300">{title}</h2>
      <p className={`text-${color}-600 text-2xl font-bold`}>
        {formatCurrency(value)}
      </p>
    </div>
    
  );
}