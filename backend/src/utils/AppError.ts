export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }

  static badRequest(message: string) {
    return new AppError(message, 400);
  }

  static unauthorized(message = "Não autenticado.") {
    return new AppError(message, 401);
  }

  static forbidden(message = "Acesso negado.") {
    return new AppError(message, 403);
  }

  static notFound(message = "Recurso não encontrado.") {
    return new AppError(message, 404);
  }

  static conflict(message: string) {
    return new AppError(message, 409);
  }
}
