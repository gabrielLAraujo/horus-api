import fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { logRoutes } from './routes/logRoutes'
import { userRoutes } from './routes/userRoutes'
import { projectRoutes } from './routes/projectRoutes'

export const app = fastify()

// Swagger
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

app.get('/health', async () => {
  return { status: 'ok' }
})
