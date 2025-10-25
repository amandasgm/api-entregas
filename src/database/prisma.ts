// 12. Configuração de conecxão com o banco de dados usando Prisma
import { PrismaClient } from '@prisma/client';


export const prisma = new PrismaClient({
  // se estiver em desenvolvimento, logar todas as queries para facilitar o debug
  log: process.env.NODE_ENV === 'production' ? [] : ['query'],
});