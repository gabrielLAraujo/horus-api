import { PrismaClient } from '@prisma/client'

// Evitar múltiplas instâncias do PrismaClient durante o hot reload
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 