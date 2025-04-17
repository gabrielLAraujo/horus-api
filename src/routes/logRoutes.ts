import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export async function logRoutes(app: FastifyInstance) {
  app.post("/projects/:projectId/routes", async (request, reply) => {
    const paramsSchema = z.object({
      projectId: z.string().uuid(),
    });

    //array de rotas
    const routeSchema = z
      .object({
        path: z.string(),
        method: z.string(),
      })
      .array();

    const { projectId } = paramsSchema.parse(request.params);
    const routeData = routeSchema.parse(request.body);
    const projectExist = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });

    if (!projectExist) {
      return reply.status(404).send({ error: "Projeto não encontrado" });
    }

    const routes = await prisma.route.createMany({
      data: routeData.map((route) => ({
        path: route.path,
        method: route.method,
        projectId,
      })),
    });

    return reply.status(201).send(routes);
  });

  app.post("/projects/:projectId/logs", async (request, reply) => {
    const paramsSchema = z.object({
      projectId: z.string().uuid(),
    });

    const logSchema = z.object({
      messageId: z.string(),
      method: z.string(),
      path: z.string(),
      statusCode: z.number(),
      duration: z.number(),
      requestSize: z.string().or(z.number()).nullable().optional(),
      responseSize: z.string().or(z.number()).nullable().optional(),
      timestamp: z.string().or(z.date()),
    });

    const { projectId } = paramsSchema.parse(request.params);
    const logData = logSchema.parse(request.body);

    const projectExist = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });

    if (!projectExist) {
      return reply.status(404).send({ error: "Projeto não encontrado" });
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
        timestamp: new Date(logData.timestamp),
        projectId,
      },
    });

    return reply.status(201).send(log);
  });

  app.post("/projects/:projectId/logs/body", async (request, reply) => {
    const bodySchema = z.object({
      messageId: z.string(),
      method: z.string(),
      path: z.string(),
      url: z.string(),
      request: z
        .object({
          body: z.string().optional(),
          headers: z.array(z.tuple([z.string(), z.string()])).optional(),
        })
        .optional(),
      response: z
        .object({
          body: z.string().optional(),
          headers: z.array(z.tuple([z.string(), z.string()])).optional(),
        })
        .optional(),
      exception: z.any().optional(),
    });

    try {
      const bodyData = bodySchema.safeParse(request.body);
      if (!bodyData.success) {
        console.error("Erro de validação:", bodyData.error);
        return reply
          .status(400)
          .send({ error: "Dados inválidos", details: bodyData.error });
      }

      const logBody = await prisma.logBody.create({
        data: {
          messageId: bodyData.data.messageId,
          method: bodyData.data.method,
          path: bodyData.data.path,
          url: bodyData.data.url,
          request: bodyData.data.request || Prisma.JsonNull,
          response: bodyData.data.response || Prisma.JsonNull,
          exception: bodyData.data.exception || Prisma.JsonNull,
        },
      });

      return reply.status(201).send(logBody);
    } catch (error) {
      console.error("Erro interno:", error);
      return reply.status(500).send({ error: "Erro interno do servidor" });
    }
  });

  app.get("/projects/:projectId/logs", async (request, reply) => {
    const paramsSchema = z.object({
      projectId: z.string().uuid(),
    });

    const { projectId } = paramsSchema.parse(request.params);

    const logs = await prisma.log.findMany({
      where: { projectId },
      include: {
        bodyData: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return logs;
  });
}
