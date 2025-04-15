import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const unlink = promisify(fs.unlink)
const mkdir = promisify(fs.mkdir)

// Diretório para armazenar os arquivos de buffer
const BUFFER_DIR = path.join(process.cwd(), 'buffer')
const FLUSH_INTERVAL = 5 * 60 * 1000 // 5 minutos em milissegundos
const MAX_BUFFER_SIZE = 1000 // Número máximo de requisições por arquivo

interface RequestData {
  uuid: string
  request: {
    timestamp: number
    method: string
    path: string
    url: string
    headers: [string, string][]
    size: number
    body: string
  }
  response: {
    statusCode: number
    responseTime: number
    headers: [string, string][]
    size: number
    body: string
  }
  exception: any
}

class RequestBuffer {
  private buffer: RequestData[] = []
  private flushInterval: NodeJS.Timeout | null = null
  private isProcessing = false

  constructor() {
    this.initialize()
  }

  private async initialize() {
    try {
      // Cria o diretório de buffer se não existir
      await mkdir(BUFFER_DIR, { recursive: true })
      
      // Inicia o intervalo de flush
      this.startFlushInterval()
      
      // Processa arquivos pendentes ao iniciar
      await this.processPendingFiles()
    } catch (error) {
      console.error('Erro ao inicializar o buffer:', error)
    }
  }

  private startFlushInterval() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    
    this.flushInterval = setInterval(() => {
      this.flush().catch(error => {
        console.error('Erro ao fazer flush do buffer:', error)
      })
    }, FLUSH_INTERVAL)
  }

  public async add(data: RequestData) {
    this.buffer.push(data)
    
    // Se o buffer atingir o tamanho máximo, faz flush imediatamente
    if (this.buffer.length >= MAX_BUFFER_SIZE) {
      await this.flush()
    }
  }

  public async flush() {
    if (this.isProcessing || this.buffer.length === 0) {
      return
    }
    
    this.isProcessing = true
    
    try {
      const timestamp = Date.now()
      const filename = path.join(BUFFER_DIR, `requests-${timestamp}.json`)
      
      // Salva o buffer atual em um arquivo
      await writeFile(filename, JSON.stringify(this.buffer), 'utf8')
      
      // Limpa o buffer
      this.buffer = []
      
      // Processa o arquivo em background
      this.processFile(filename).catch(error => {
        console.error(`Erro ao processar arquivo ${filename}:`, error)
      })
    } catch (error) {
      console.error('Erro ao fazer flush do buffer:', error)
    } finally {
      this.isProcessing = false
    }
  }

  private async processPendingFiles() {
    try {
      const files = fs.readdirSync(BUFFER_DIR)
        .filter(file => file.startsWith('requests-') && file.endsWith('.json'))
      
      for (const file of files) {
        const filepath = path.join(BUFFER_DIR, file)
        await this.processFile(filepath)
      }
    } catch (error) {
      console.error('Erro ao processar arquivos pendentes:', error)
    }
  }

  private async processFile(filepath: string) {
    try {
      // Lê o arquivo
      const content = await readFile(filepath, 'utf8')
      const requests = JSON.parse(content)
      
      // Envia as requisições para a API
      for (const request of requests) {
        await this.sendToApi(request)
      }
      
      // Remove o arquivo após processamento bem-sucedido
      await unlink(filepath)
    } catch (error) {
      console.error(`Erro ao processar arquivo ${filepath}:`, error)
    }
  }

  private async sendToApi(data: RequestData) {
    try {
      // Converte o formato para o formato esperado pela API
      const apiData = {
        timestamp: data.request.timestamp,
        instance_uuid: data.uuid,
        message_uuid: data.uuid,
        requests: [{
          consumer: null,
          method: data.request.method,
          path: data.request.path,
          status_code: data.response.statusCode,
          request_count: 1,
          request_size_sum: data.request.size,
          response_size_sum: data.response.size,
          response_times: { [Math.floor(data.response.responseTime * 1000)]: 1 },
          request_sizes: { [data.request.size]: 1 },
          response_sizes: { [data.response.size]: 1 },
          validation_errors: [],
          server_errors: data.exception ? [data.exception] : [],
          consumers: []
        }]
      }
      
      const response = await fetch('http://localhost:3000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })
      
      if (!response.ok) {
        throw new Error(`Erro ao enviar requisições: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Erro ao enviar requisições para a API:', error)
      // Aqui poderíamos implementar uma lógica de retry ou mover para uma fila de falhas
    }
  }

  public async shutdown() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
      this.flushInterval = null
    }
    
    // Faz um último flush antes de encerrar
    if (this.buffer.length > 0) {
      await this.flush()
    }
  }
}

// Exporta uma instância única do buffer
export const requestBuffer = new RequestBuffer()

// Garante que o buffer seja encerrado corretamente quando a aplicação for finalizada
process.on('SIGINT', async () => {
  await requestBuffer.shutdown()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await requestBuffer.shutdown()
  process.exit(0)
}) 