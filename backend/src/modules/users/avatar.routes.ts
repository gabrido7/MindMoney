import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { usersRepository } from "./users.repository";

/**
 * Serve a foto de perfil direto do banco. Pública de propósito: o <img> do
 * frontend não envia o token de login, então a proteção é a chave aleatória
 * (UUID) na URL, impossível de adivinhar -- a mesma ideia do nome de arquivo
 * aleatório de quando as fotos ficavam em disco. Trocar a foto gera chave nova.
 */
export const avatarRouter = Router();

const FILE_KEY = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

avatarRouter.get(
  "/:fileKey",
  asyncHandler(async (req, res) => {
    const fileKey = String(req.params.fileKey);
    // chave fora do formato (inclusive os nomes de arquivo antigos) = 404 sem consultar o banco
    const avatar = FILE_KEY.test(fileKey) ? await usersRepository.findAvatarByKey(fileKey) : null;
    if (!avatar) {
      res.status(404).end();
      return;
    }

    // helmet já manda "same-origin"; o frontend está em outro domínio, então
    // só esta rota libera cross-origin (não é CORS: <img> não faz preflight).
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Content-Type", avatar.mime_type);
    res.setHeader("X-Content-Type-Options", "nosniff");
    // a chave muda a cada foto nova, então o navegador pode guardar para sempre
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(avatar.data);
  })
);
