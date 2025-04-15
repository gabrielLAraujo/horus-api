import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { timestamp, instance_uuid, message_uuid, requests } = body

    const savedRequests = await Promise.all(
      requests.map(async (req: any) => {
        const route = await prisma.route.findFirst({
          where: {
            instanceUuid: instance_uuid,
            messageUuid: message_uuid,
            method: req.method,
            path: req.path,
          },
        })

        if (!route) {
          throw new Error('Rota não encontrada')
        }

        return prisma.request.create({
          data: {
            routeId: route.id,
            timestamp: new Date(timestamp * 1000),
            consumer: req.consumer,
            method: req.method,
            path: req.path,
            statusCode: req.status_code,
            requestCount: req.request_count,
            requestSizeSum: req.request_size_sum,
            responseSizeSum: req.response_size_sum,
            responseTimes: req.response_times,
            requestSizes: req.request_sizes,
            responseSizes: req.response_sizes,
            validationErrors: req.validation_errors,
            serverErrors: req.server_errors,
            consumers: req.consumers,
          },
        })
      })
    )

    return NextResponse.json({ data: savedRequests })
  } catch (error) {
    console.error('Erro ao salvar requisições:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [requests, total] = await Promise.all([
      prisma.request.findMany({
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          route: true,
        },
      }),
      prisma.request.count(),
    ])

    return NextResponse.json({
      data: requests,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erro ao buscar requisições:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
} 