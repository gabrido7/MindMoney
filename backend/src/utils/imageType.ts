export type AvatarMime = "image/png" | "image/jpeg" | "image/webp";

/**
 * Descobre o formato olhando os primeiros bytes do arquivo (a "assinatura"),
 * não o Content-Type que o navegador declarou -- esse campo vem do cliente e
 * qualquer um pode mandar "image/png" para um arquivo que não é PNG.
 * Devolve null se não for PNG, JPEG nem WEBP.
 */
export function detectImageType(buf: Buffer): AvatarMime | null {
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  ) {
    return "image/png";
  }
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }
  // WEBP: "RIFF" + 4 bytes de tamanho + "WEBP"
  if (
    buf.length >= 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}
