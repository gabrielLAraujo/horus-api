import { app } from './app'

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000
    const host = process.env.HOST || 'localhost'

    await app.listen({ port, host })
    console.log(`Servidor rodando em http://${host}:${port}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
