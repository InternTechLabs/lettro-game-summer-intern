import { type Server as HttpServer, type IncomingMessage } from 'http'
import { logger } from '../config/logger'

import { type WebSocket, WebSocketServer, type RawData } from 'ws'

export function setupWebSocket (server: HttpServer) {
  const wss = new WebSocketServer({ server, path: '/ws' })

  interface EchoMessage {
    type: 'echo'
    data: unknown
    timestamp: string
  }

  interface ErrorMessage {
    type: 'error'
    message: string
  }

type OutgoingMessage = EchoMessage | ErrorMessage

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  logger.info(`WebSocket connection established from ${req.socket.remoteAddress}`)

  ws.on('message', (data: RawData) => {
    try {
      const message: unknown = JSON.parse(data.toString())
      logger.info('WebSocket message received:', message)

      // Echo the message back
      const echoMessage: EchoMessage = {
        type: 'echo',
        data: message,
        timestamp: new Date().toISOString()
      }
      ws.send(
        JSON.stringify(echoMessage)
      )
    } catch (error: unknown) {
      logger.error('WebSocket message parsing error:', error)
      const errorMessage: ErrorMessage = {
        type: 'error',
        message: 'Invalid message format'
      }
      ws.send(
        JSON.stringify(errorMessage)
      )
    }
  })

  ws.on('close', () => {
    logger.info('WebSocket connection closed')
  })

  ws.on('error', (error: Error) => {
    logger.error('WebSocket error:', error)
  })
})

return wss
}
