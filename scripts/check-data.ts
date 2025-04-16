import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Verificando dados no banco...')

  // Verificar usuários
  const users = await prisma.user.findMany()
  console.log('\nUsuários:', users)

  // Verificar projetos
  const projects = await prisma.project.findMany({
    include: {
      user: true
    }
  })
  console.log('\nProjetos:', projects)

  // Verificar logs
  const logs = await prisma.log.findMany({
    include: {
      project: true,
      bodyData: true
    }
  })
  console.log('\nLogs:', logs)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 