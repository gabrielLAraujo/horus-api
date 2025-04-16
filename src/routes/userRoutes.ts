import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { hash } from 'bcrypt'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6)
    })

    const { name, email, password } = createUserSchema.parse(request.body)
    
    const hashedPassword = await hash(password, 10)

    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      })

      return reply.status(201).send(user)
    } catch (error: any) {
      if (error.code === 'P2002') {
        return reply.status(400).send({ error: 'Email já cadastrado' })
      }
      throw error
    }
  })

  app.get('/users/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        projects: true,
        createdAt: true
      }
    })

    if (!user) {
      return reply.status(404).send({ error: 'Usuário não encontrado' })
    }

    return user
  })
} 