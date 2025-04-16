import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { Prisma } from '@prisma/client'

export async function logRoutes(app: FastifyInstance) {
  app.post('/projects/:projectId/logs', async (request, reply) => {
    const paramsSchema = z.object({
      projectId: z.string().uuid()
    })

    const logSchema = z.object({
      messageId: z.string(),
      method: z.string(),
      path: z.string(),
      statusCode: z.number(),
      duration: z.number(),
      requestSize: z.string().or(z.number()).nullable().optional(),
      responseSize: z.string().or(z.number()).nullable().optional(),
      error: z.unknown().optional(),
      timestamp: z.string().or(z.date())
    })

    const { projectId } = paramsSchema.parse(request.params)
    const logData = logSchema.parse(request.body)

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return reply.status(404).send({ error: 'Projeto não encontrado' })
    }

    const log = await prisma.log.create({
      data: {
        messageId: logData.messageId,
        method: logData.method,
        path: logData.path,
        statusCode: logData.statusCode,
        duration: logData.duration,
        requestSize: logData.requestSize?.toString(),
        responseSize: logData.responseSize?.toString(),
        error: logData.error ? JSON.stringify(logData.error) : Prisma.JsonNull,
        timestamp: new Date(logData.timestamp),
        projectId
      }
    })

    return reply.status(201).send(log)
  })

  app.post('/projects/:projectId/logs/body', async (request, reply) => {
    const paramsSchema = z.object({
      projectId: z.string().uuid()
    })

    const bodySchema = z.object({
      messageId: z.string(),
      request: z.object({
        body: z.unknown().optional(),
        headers: z.unknown().optional()
      }),
      response: z.object({
        body: z.unknown().optional(),
        headers: z.unknown().optional()
      })
    })

    const { projectId } = paramsSchema.parse(request.params)
    const bodyData = bodySchema.parse(request.body)

    const log = await prisma.log.findFirst({
      where: { 
        AND: [
          { messageId: bodyData.messageId },
          { projectId }
        ]
      }
    })

    if (!log) {
      return reply.status(404).send({ error: 'Log não encontrado' })
    }

    const logBody = await prisma.logBody.create({
      data: {
        logId: log.id,
        requestBody: bodyData.request.body || Prisma.JsonNull,
        reqHeaders: bodyData.request.headers || Prisma.JsonNull,
        respBody: bodyData.response.body || Prisma.JsonNull,
        respHeaders: bodyData.response.headers || Prisma.JsonNull
      }
    })

    return reply.status(201).send(logBody)
  })

  app.get('/projects/:projectId/logs', async (request, reply) => {
    const paramsSchema = z.object({
      projectId: z.string().uuid()
    })

    const { projectId } = paramsSchema.parse(request.params)

    const logs = await prisma.log.findMany({
      where: { projectId },
      include: {
        bodyData: true
      },
      orderBy: {
        timestamp: 'desc'
      }
    })

    return logs
  })
} 