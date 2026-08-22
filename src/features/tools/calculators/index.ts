import type { ComponentType } from "react";
import type { ToolId } from "../types";
import CompoundInterestCalculator from "./CompoundInterestCalculator";
import SimpleInterestCalculator from "./SimpleInterestCalculator";
import InflationCalculator from "./InflationCalculator";
import PurchasingPowerCalculator from "./PurchasingPowerCalculator";
import EmergencyFundCalculator from "./EmergencyFundCalculator";
import RetirementCalculator from "./RetirementCalculator";
import MonthlyContributionCalculator from "./MonthlyContributionCalculator";
import FinancingCalculator from "./FinancingCalculator";
import LoanCalculator from "./LoanCalculator";
import InvestmentComparisonCalculator from "./InvestmentComparisonCalculator";
import RealReturnCalculator from "./RealReturnCalculator";

export const CALCULATOR_COMPONENTS: Record<ToolId, ComponentType> = {
  "juros-compostos": CompoundInterestCalculator,
  "juros-simples": SimpleInterestCalculator,
  inflacao: InflationCalculator,
  "poder-de-compra": PurchasingPowerCalculator,
  "reserva-de-emergencia": EmergencyFundCalculator,
  aposentadoria: RetirementCalculator,
  "aportes-mensais": MonthlyContributionCalculator,
  financiamento: FinancingCalculator,
  emprestimo: LoanCalculator,
  "comparacao-de-investimentos": InvestmentComparisonCalculator,
  "rentabilidade-real": RealReturnCalculator,
};
