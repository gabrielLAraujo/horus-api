import { NextResponse } from 'next/server'
import { requestBuffer } from '@/lib/requestBuffer'

export async function POST(request: Request) {
  try {
    // Força o flush do buffer
    await requestBuffer.flush()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao forçar flush do buffer:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
} 