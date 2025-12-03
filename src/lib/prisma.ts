import { PrismaClient } from '@prisma/client';

// Defina um tipo global para o PrismaClient no NodeJS globalThis
declare global {
  var prisma: PrismaClient | undefined;
}

// Verifique se já existe uma instância do PrismaClient no globalThis
// Se não existir, crie uma nova instância
const prisma = globalThis.prisma || new PrismaClient();

// Se não estivermos em produção, armazene a instância no globalThis
// Isso evita a criação de múltiplas instâncias do PrismaClient durante o desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;