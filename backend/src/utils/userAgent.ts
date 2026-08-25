/**
 * Rótulo legível a partir de um User-Agent bruto, só para a lista de
 * "sessões ativas" reconhecer o dispositivo -- não é uma lib de detecção
 * completa (não precisa: o único uso real é exibição, nunca decisão de
 * lógica de negócio), só o suficiente para diferenciar navegador/SO comuns.
 */
export function describeUserAgent(userAgent: string | null): string {
  if (!userAgent) return "Dispositivo desconhecido";

  const os = userAgent.includes("Windows")
    ? "Windows"
    : userAgent.includes("Mac OS")
      ? "macOS"
      : userAgent.includes("Android")
        ? "Android"
        : /iPhone|iPad/.test(userAgent)
          ? "iOS"
          : userAgent.includes("Linux")
            ? "Linux"
            : null;

  const browser = /Edg\//.test(userAgent)
    ? "Edge"
    : /Chrome\//.test(userAgent)
      ? "Chrome"
      : /Firefox\//.test(userAgent)
        ? "Firefox"
        : /Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)
          ? "Safari"
          : null;

  if (browser && os) return `${browser} no ${os}`;
  if (browser) return browser;
  if (os) return os;
  return "Dispositivo desconhecido";
}
