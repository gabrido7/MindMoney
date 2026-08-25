import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import multer from "multer";
import { AppError } from "../utils/AppError";

export const AVATAR_UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads", "avatars");
fs.mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: AVATAR_UPLOAD_DIR,
  filename: (_req, file, cb) => {
    cb(null, `${crypto.randomUUID()}${ALLOWED_MIME_TO_EXT[file.mimetype]}`);
  },
});

export const avatarUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB -- suficiente para uma foto de perfil, não para abusar do disco
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TO_EXT[file.mimetype]) {
      cb(AppError.badRequest("Formato de imagem não suportado. Envie PNG, JPG ou WEBP."));
      return;
    }
    cb(null, true);
  },
});
