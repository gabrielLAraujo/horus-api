import { app } from './src/app'
import { createServer, IncomingMessage, ServerResponse } from 'http'

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  app.ready().then(() => {
    app.server.emit('request', req, res)
  })
})

export default server
