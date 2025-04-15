import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Limpa o banco de dados
  await prisma.metric.deleteMany()
  await prisma.log.deleteMany()
  await prisma.user.deleteMany()

  // Cria usuário admin
  const adminPassword = await hash('admin', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@horus.com',
      password: adminPassword,
      name: 'Administrador',
    },
  })

  console.log('Usuário admin criado:', admin.email)

  // Cria métricas de exemplo
  const metrics = [
    {
      appName: 'api-exemplo',
      endpoint: '/api/users',
      method: 'GET',
      duration: 150.5,
      status: 200,
      metadata: { userId: '123', role: 'admin' },
    },
    {
      appName: 'api-exemplo',
      endpoint: '/api/products',
      method: 'POST',
      duration: 250.8,
      status: 201,
      metadata: { productId: '456', category: 'electronics' },
    },
    {
      appName: 'api-exemplo',
      endpoint: '/api/orders',
      method: 'GET',
      duration: 180.2,
      status: 404,
      metadata: { orderId: '789' },
    },
  ]

  for (const metric of metrics) {
    await prisma.metric.create({
      data: metric,
    })
  }

  // Cria logs de exemplo
  const logs = [
    {
      appName: 'api-exemplo',
      level: 'INFO',
      message: 'Usuário autenticado com sucesso',
      context: { userId: '123', ip: '192.168.1.1' },
    },
    {
      appName: 'api-exemplo',
      level: 'WARN',
      message: 'Tentativa de acesso não autorizado',
      context: { userId: '456', ip: '192.168.1.2' },
    },
    {
      appName: 'api-exemplo',
      level: 'ERROR',
      message: 'Erro ao processar pagamento',
      context: { orderId: '789', error: 'Insufficient funds' },
      trace: 'Error: Insufficient funds\n    at PaymentProcessor.process (/app/services/payment.js:42:15)\n    at async OrderService.createOrder (/app/services/order.js:78:23)',
    },
  ]

  for (const log of logs) {
    await prisma.log.create({
      data: log,
    })
  }

  console.log('Banco de dados populado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 