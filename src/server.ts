import fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { logRoutes } from './routes/logRoutes'
import { userRoutes } from './routes/userRoutes'
import { projectRoutes } from './routes/projectRoutes'

const app = fastify()

// Configuração do Swagger
app.register(swagger, {
  openapi: {
    info: {
      title: 'Horus API Documentation',
      description: 'API para logging de requisições com múltiplos projetos',
      version: '1.0.0'
    },
    tags: [
      { name: 'users', description: 'Endpoints de usuários' },
      { name: 'projects', description: 'Endpoints de projetos' },
      { name: 'logs', description: 'Endpoints de logs' }
    ]
  }
})

// Configuração da UI do Swagger
app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  }
})

app.register(cors)
app.register(userRoutes)
app.register(projectRoutes)
app.register(logRoutes)

// Rota de health check para a Vercel
app.get('/health', async () => {
  return { status: 'ok' }
})

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
    const host = process.env.HOST || '0.0.0.0'
    
    await app.listen({ port, host })
    console.log(`Servidor rodando em http://${host}:${port}`)
    console.log('Documentação disponível em: http://localhost:3000/docs')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start() 