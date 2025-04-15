import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { instance_uuid, message_uuid, paths, versions, client } = body

    const routes = await Promise.all(
      paths.map(async (path: { method: string; path: string }) => {
        return prisma.route.upsert({
          where: {
            instanceUuid_messageUuid_method_path: {
              instanceUuid: instance_uuid,
              messageUuid: message_uuid,
              method: path.method,
              path: path.path,
            },
          },
          update: {},
          create: {
            instanceUuid: instance_uuid,
            messageUuid: message_uuid,
            method: path.method,
            path: path.path,
            versions,
            client,
          },
        })
      })
    )

    return NextResponse.json({ data: routes })
  } catch (error) {
    console.error('Erro ao salvar rotas:', error)
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

    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.route.count(),
    ])

    return NextResponse.json({
      data: routes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erro ao buscar rotas:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
} 