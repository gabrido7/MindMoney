import multer from "multer";
import { AppError } from "../utils/AppError";

const ALLOWED_MIMES = new Set(["image/png", "image/jpeg", "image/webp"]);

// A foto fica na memória só até o service gravá-la no MySQL (tabela
// user_avatars) -- nada vai para o disco, que no Render é apagado a cada
// deploy. O tipo real é conferido pelos bytes em usersController.uploadAvatar.
export const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB -- suficiente para uma foto de perfil, não para abusar do banco
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIMES.has(file.mimetype)) {
      cb(AppError.badRequest("Formato de imagem não suportado. Envie PNG, JPG ou WEBP."));
      return;
    }
    cb(null, true);
  },
});
