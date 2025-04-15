import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const metric = await prisma.metric.create({
      data: {
        appName: body.appName,
        endpoint: body.endpoint,
        method: body.method,
        duration: body.duration,
        status: body.status,
        metadata: body.metadata || {},
      },
    })
    return NextResponse.json(metric, { status: 201 })
  } catch (error) {
    console.error('Erro ao salvar métrica:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const appName = searchParams.get('appName')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = appName ? { appName } : {}

    const [metrics, total] = await Promise.all([
      prisma.metric.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: limit,
        skip,
      }),
      prisma.metric.count({ where }),
    ])

    return NextResponse.json({
      data: metrics,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erro ao buscar métricas:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
} 