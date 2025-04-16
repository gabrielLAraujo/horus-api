import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed...')
  
  // Criar usuário mock
  console.log('Criando usuário...')
  const hashedPassword = await hash('senha123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'admin@exemplo.com' },
    update: {},
    create: {
      email: 'admin@exemplo.com',
      name: 'Administrador',
      password: hashedPassword,
    },
  })
  console.log('Usuário criado:', user)

  // Criar projetos mock
  console.log('Criando projetos...')
  const project1 = await prisma.project.create({
    data: {
      name: 'Projeto Exemplo 1',
      description: 'Descrição do projeto exemplo 1',
      userId: user.id,
    },
  })
  console.log('Projeto 1 criado:', project1)

  const project2 = await prisma.project.create({
    data: {
      name: 'Projeto Exemplo 2',
      description: 'Descrição do projeto exemplo 2',
      userId: user.id,
    },
  })
  console.log('Projeto 2 criado:', project2)

  // Criar logs mock para o projeto 1
  console.log('Criando logs para projeto 1...')
  const log1 = await prisma.log.create({
    data: {
      messageId: 'msg-001',
      method: 'GET',
      path: '/api/users',
      statusCode: 200,
      duration: 150.5,
      requestSize: '1024',
      responseSize: '2048',
      timestamp: new Date(),
      projectId: project1.id,
    },
  })
  console.log('Log 1 criado:', log1)

  await prisma.logBody.create({
    data: {
      logId: log1.id,
      requestBody: { query: { page: 1 } },
      reqHeaders: { 'content-type': 'application/json' },
      respBody: { users: [] },
      respHeaders: { 'content-type': 'application/json' },
    },
  })
  console.log('LogBody 1 criado')

  // Criar logs mock para o projeto 2
  console.log('Criando logs para projeto 2...')
  const log2 = await prisma.log.create({
    data: {
      messageId: 'msg-002',
      method: 'POST',
      path: '/api/products',
      statusCode: 201,
      duration: 200.3,
      requestSize: '512',
      responseSize: '1024',
      timestamp: new Date(),
      projectId: project2.id,
    },
  })
  console.log('Log 2 criado:', log2)

  await prisma.logBody.create({
    data: {
      logId: log2.id,
      requestBody: { name: 'Produto Teste', price: 99.99 },
      reqHeaders: { 'content-type': 'application/json' },
      respBody: { id: 1, name: 'Produto Teste', price: 99.99 },
      respHeaders: { 'content-type': 'application/json' },
    },
  })
  console.log('LogBody 2 criado')

  console.log('Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 