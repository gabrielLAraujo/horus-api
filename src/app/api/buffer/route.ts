import { NextResponse } from 'next/server'
import { requestBuffer } from '@/lib/requestBuffer'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Adiciona a requisição ao buffer
    await requestBuffer.add(data)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao adicionar requisição ao buffer:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
} 