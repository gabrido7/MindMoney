import { useState } from "react";
import { calculateRealReturn } from "../utils/calculations";
import { parseLocaleNumber } from "../utils/number";
import { formatPercent } from "../../../utils/formatters";
import NumberField from "../components/NumberField";
import ResultStat from "../components/ResultStat";
import CalculatorLayout from "../components/CalculatorLayout";

export default function RealReturnCalculator() {
  const [nominalRate, setNominalRate] = useState("10");
  const [inflationRate, setInflationRate] = useState("5");

  const nominalNum = parseLocaleNumber(nominalRate);
  const inflationNum = parseLocaleNumber(inflationRate);
  const valid = [nominalNum, inflationNum].every(Number.isFinite);

  const result = valid ? calculateRealReturn({ nominalRatePercent: nominalNum, inflationRatePercent: inflationNum }) : null;

  return (
    <CalculatorLayout
      inputs={
        <>
          <NumberField id="rr-nominal" label="Rentabilidade nominal (no período)" value={nominalRate} onChange={setNominalRate} suffix="%" placeholder="10" />
          <NumberField id="rr-inflation" label="Inflação (no mesmo período)" value={inflationRate} onChange={setInflationRate} suffix="%" placeholder="5" />
        </>
      }
      results={
        result ? (
          <>
            <ResultStat
              label="Rentabilidade real"
              value={formatPercent(result.realRatePercent, 2)}
              tone={result.realRatePercent >= 0 ? "positive" : "negative"}
              size="lg"
            />
            <ResultStat label="Aproximação simples (nominal − inflação)" value={formatPercent(result.approxRealRatePercent, 2)} />
          </>
        ) : (
          <p className="text-sm text-gray-400">Preencha os dados para calcular.</p>
        )
      }
      note="A rentabilidade real usa a fórmula de Fisher: (1 + nominal) ÷ (1 + inflação) − 1. Ela é mais precisa que a aproximação simples (só subtrair a inflação do nominal), especialmente quando as taxas são mais altas."
    />
  );
}
