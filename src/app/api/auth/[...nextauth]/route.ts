import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Criando o handler do NextAuth
const handler = NextAuth(authOptions)

// Exportando o handler para a rota
export const GET = handler
export const POST = handler 