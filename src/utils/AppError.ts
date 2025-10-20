// 5.3 Classe AppError para erros personalizados
class AppError {
  message: string; 
  statusCode: number;
  
  constructor(message: string, statusCode: number = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export { AppError };