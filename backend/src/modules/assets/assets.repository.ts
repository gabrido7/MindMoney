import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";
import type { AssetType, AssetValueUpdateBodyInput } from "./assets.validation";

export interface AssetRow extends RowDataPacket {
  id: number;
  user_id: number;
  type: AssetType;
  name: string;
  created_at: string;
}

export interface AssetWithCurrentValueRow extends AssetRow {
  current_value: string | null;
  valued_at: string | null;
}

export interface AssetValueUpdateRow extends RowDataPacket {
  id: number;
  asset_id: number;
  value: string;
  valued_at: string;
  note: string | null;
  created_at: string;
}

export interface AssetValueUpdateWithAssetNameRow extends AssetValueUpdateRow {
  asset_name: string;
}

export const assetsRepository = {
  /** Uma query só (LEFT JOIN + window function), nunca N+1 buscando o valor mais recente por ativo separadamente. */
  async listByUser(userId: number): Promise<AssetWithCurrentValueRow[]> {
    const [rows] = await pool.query<AssetWithCurrentValueRow[]>(
      `SELECT a.*, v.value AS current_value, v.valued_at AS valued_at
       FROM assets a
       LEFT JOIN (
         SELECT asset_id, value, valued_at,
                ROW_NUMBER() OVER (PARTITION BY asset_id ORDER BY valued_at DESC, id DESC) AS rn
         FROM asset_value_updates
       ) v ON v.asset_id = a.id AND v.rn = 1
       WHERE a.user_id = ?
       ORDER BY a.created_at DESC`,
      [userId]
    );
    return rows;
  },

  async create(
    userId: number,
    input: { type: AssetType; name: string }
  ): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO assets (user_id, type, name) VALUES (?, ?, ?)",
      [userId, input.type, input.name]
    );
    return result.insertId;
  },

  async findByIdAndUser(id: number, userId: number): Promise<AssetRow | null> {
    const [rows] = await pool.query<AssetRow[]>("SELECT * FROM assets WHERE id = ? AND user_id = ? LIMIT 1", [
      id,
      userId,
    ]);
    return rows[0] ?? null;
  },

  async remove(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM assets WHERE id = ? AND user_id = ?", [
      id,
      userId,
    ]);
    return result.affectedRows > 0;
  },

  async currentValue(assetId: number): Promise<{ value: number; valuedAt: string } | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT value, valued_at FROM asset_value_updates WHERE asset_id = ? ORDER BY valued_at DESC, id DESC LIMIT 1",
      [assetId]
    );
    const row = rows[0];
    return row ? { value: Number(row.value), valuedAt: row.valued_at } : null;
  },

  async listValueUpdates(assetId: number): Promise<AssetValueUpdateRow[]> {
    const [rows] = await pool.query<AssetValueUpdateRow[]>(
      "SELECT * FROM asset_value_updates WHERE asset_id = ? ORDER BY valued_at DESC, id DESC",
      [assetId]
    );
    return rows;
  },

  /** Todo o histórico de valor do usuário, de todos os ativos, com o nome do ativo já junto -- pro histórico global. */
  async listAllValueUpdatesByUser(userId: number): Promise<AssetValueUpdateWithAssetNameRow[]> {
    const [rows] = await pool.query<AssetValueUpdateWithAssetNameRow[]>(
      `SELECT v.*, a.name AS asset_name
       FROM asset_value_updates v
       JOIN assets a ON a.id = v.asset_id
       WHERE a.user_id = ?
       ORDER BY v.valued_at DESC, v.id DESC`,
      [userId]
    );
    return rows;
  },

  async addValueUpdate(assetId: number, input: AssetValueUpdateBodyInput): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO asset_value_updates (asset_id, value, valued_at, note) VALUES (?, ?, ?, ?)",
      [assetId, input.value, input.valuedAt, input.note ?? null]
    );
    return result.insertId;
  },

  async findValueUpdateByIdAndAsset(id: number, assetId: number): Promise<AssetValueUpdateRow | null> {
    const [rows] = await pool.query<AssetValueUpdateRow[]>(
      "SELECT * FROM asset_value_updates WHERE id = ? AND asset_id = ? LIMIT 1",
      [id, assetId]
    );
    return rows[0] ?? null;
  },

  async updateValueUpdate(id: number, assetId: number, input: AssetValueUpdateBodyInput): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE asset_value_updates SET value = ?, valued_at = ?, note = ? WHERE id = ? AND asset_id = ?",
      [input.value, input.valuedAt, input.note ?? null, id, assetId]
    );
    return result.affectedRows > 0;
  },

  async removeValueUpdate(id: number, assetId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM asset_value_updates WHERE id = ? AND asset_id = ?",
      [id, assetId]
    );
    return result.affectedRows > 0;
  },

  /**
   * Espelha debtsRepository.totalRemainingAsOf: soma o valor mais recente
   * de cada ativo que já tinha ALGUM registro até dateISO (updates depois
   * dessa data são ignorados -- "congela" o retrato do patrimônio naquele
   * momento). Ativo sem nenhum registro até a data simplesmente não conta
   * ainda, via INNER JOIN (diferente de listByUser, que usa LEFT JOIN pra
   * mostrar até ativo sem valor -- aqui um ativo sem valor até a data não
   * deveria contribuir com R$0 nem sumir de forma ambígua, só não existe
   * "ainda" nesse ponto do tempo).
   */
  async totalValueAsOf(userId: number, dateISO: string): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(v.value), 0) AS total
       FROM assets a
       JOIN (
         SELECT asset_id, value,
                ROW_NUMBER() OVER (PARTITION BY asset_id ORDER BY valued_at DESC, id DESC) AS rn
         FROM asset_value_updates
         WHERE valued_at <= ?
       ) v ON v.asset_id = a.id AND v.rn = 1
       WHERE a.user_id = ?`,
      [dateISO, userId]
    );
    return Number(rows[0]?.total ?? 0);
  },
};
