import type { AssetType } from "../../types/api";

/** Usado em AddAssetModal, AssetsSection e AssetDistributionCard -- centralizado aqui pra não duplicar o mesmo mapa três vezes. */
export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  investimento: "Investimento",
  imovel: "Imóvel",
  veiculo: "Veículo",
  outro: "Outro",
};
