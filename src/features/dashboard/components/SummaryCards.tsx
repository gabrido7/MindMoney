import InstrumentStrip from "../../../components/ui/InstrumentStrip";
import { formatCurrency } from "../../../utils/formatters";

export default function SummaryCards({
  totalEntradas,
  totalSaidas,
  saldo,
  entradasChange,
  saidasChange,
  saldoChange,
}: {
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
  entradasChange: number;
  saidasChange: number;
  saldoChange: number;
}) {
  return (
    <InstrumentStrip
      items={[
        {
          label: "Entradas",
          value: formatCurrency(totalEntradas),
          trend: { direction: entradasChange >= 0 ? "up" : "down", value: `${Math.abs(entradasChange).toFixed(1)}%` },
        },
        {
          label: "Saídas",
          value: formatCurrency(totalSaidas),
          trend: { direction: saidasChange >= 0 ? "up" : "down", value: `${Math.abs(saidasChange).toFixed(1)}%` },
        },
        {
          label: "Saldo",
          value: formatCurrency(saldo),
          trend: { direction: saldoChange >= 0 ? "up" : "down", value: `${Math.abs(saldoChange).toFixed(1)}%` },
        },
      ]}
    />
  );
}
