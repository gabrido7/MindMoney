import type { RowDataPacket } from "mysql2";
import { pool } from "../../config/db";
import type { UpdateFinancialProfileInput } from "./financialProfile.validation";

export interface FinancialProfileRow extends RowDataPacket {
  user_id: number;
  experience_level: "iniciante" | "intermediario" | "avancado" | null;
  financial_situation: "tudo_controle" | "aperta_mas_consigo" | "vivo_no_limite" | "endividado" | null;
  income_range: "ate_2k" | "2k_5k" | "5k_10k" | "10k_20k" | "acima_20k" | null;
  income_variable: number;
  income_min: string | null;
  income_max: string | null;
  income_sources: string | null; // JSON, parseado pelo service
  priorities: string | null; // JSON, parseado pelo service
  habits: string | null; // JSON, parseado pelo service
  updated_at: string;
}

export const financialProfileRepository = {
  async findByUser(userId: number): Promise<FinancialProfileRow | null> {
    const [rows] = await pool.query<FinancialProfileRow[]>(
      "SELECT * FROM user_financial_profiles WHERE user_id = ? LIMIT 1",
      [userId]
    );
    return rows[0] ?? null;
  },

  /**
   * Atualização parcial: só mexe nas colunas que vieram no payload. O
   * onboarding salva o perfil aos pedaços (um PUT por passo do wizard), então
   * um upsert que sempre sobrescreve tudo apagaria o que um passo anterior já
   * tinha salvo. INSERT IGNORE garante que a linha existe antes do UPDATE
   * (user_id é PK, então a segunda chamada em diante já encontra a linha).
   */
  async patch(userId: number, input: UpdateFinancialProfileInput): Promise<void> {
    await pool.query("INSERT IGNORE INTO user_financial_profiles (user_id) VALUES (?)", [userId]);

    const sets: string[] = [];
    const values: unknown[] = [];
    const assign = (column: string, value: unknown) => {
      sets.push(`${column} = ?`);
      values.push(value);
    };

    if (input.experienceLevel !== undefined) assign("experience_level", input.experienceLevel);
    if (input.financialSituation !== undefined) assign("financial_situation", input.financialSituation);
    if (input.incomeRange !== undefined) assign("income_range", input.incomeRange);
    if (input.incomeVariable !== undefined) assign("income_variable", input.incomeVariable);
    if (input.incomeMin !== undefined) assign("income_min", input.incomeMin);
    if (input.incomeMax !== undefined) assign("income_max", input.incomeMax);
    if (input.incomeSources !== undefined) assign("income_sources", JSON.stringify(input.incomeSources));
    if (input.priorities !== undefined) assign("priorities", JSON.stringify(input.priorities));
    if (input.habits !== undefined) assign("habits", input.habits ? JSON.stringify(input.habits) : null);

    if (sets.length === 0) return;

    await pool.query(`UPDATE user_financial_profiles SET ${sets.join(", ")} WHERE user_id = ?`, [
      ...values,
      userId,
    ]);
  },
};
