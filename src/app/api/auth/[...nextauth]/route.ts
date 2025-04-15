import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Criando o handler do NextAuth
const handler = NextAuth(authOptions)

// Exportando apenas as funções GET e POST para a rota
export { handler as GET, handler as POST } 