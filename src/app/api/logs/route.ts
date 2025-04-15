import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const prismaClient = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const log = await prismaClient.log.create({
      data: {
        appName: body.appName,
        level: body.level,
        message: body.message,
        context: body.context || {},
        trace: body.trace,
      },
    })
    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    console.error('Erro ao salvar log:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const logs = await prisma.log.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      take: 100, // Limita a 100 logs por vez
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Erro ao buscar logs:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 