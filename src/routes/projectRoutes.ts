import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function projectRoutes(app: FastifyInstance) {
  app.post('/projects', async (request, reply) => {
    const createProjectSchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      userId: z.string().uuid()
    })

    const { name, description, userId } = createProjectSchema.parse(request.body)

    try {
      const project = await prisma.project.create({
        data: {
          name,
          description,
          userId
        }
      })

      return reply.status(201).send(project)
    } catch (error: any) {
      if (error.code === 'P2003') {
        return reply.status(400).send({ error: 'Usuário não encontrado' })
      }
      throw error
    }
  })

  app.get('/projects/:userId', async (request, reply) => {
    const paramsSchema = z.object({
      userId: z.string().uuid()
    })

    const { userId } = paramsSchema.parse(request.params)

    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        _count: {
          select: { logs: true }
        }
      }
    })

    return projects
  })
} 