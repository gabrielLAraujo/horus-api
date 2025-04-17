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