import makeJwtTokenProvider from '@providers/implementations/jwtTokenProvider'
import http from 'http'
import { Server } from 'socket.io'
import makeAdaptor from './adaptor'
import joinGameListener from './listeners/joinGame'
import leavePlayerListener from './listeners/leavePlayer'

interface IMakeSocketServerProps {
  server: http.Server
}

const makeSocketServer = ({ server }: IMakeSocketServerProps) => {
  const io = new Server(server, {
    cors: {}
  })

  const tokenProvider = makeJwtTokenProvider()

  io.use(async (socket, next) => {
    try {
      const { authorization } = socket.handshake.auth

      const playerId = await tokenProvider.validate(authorization)

      socket.data.playerId = playerId

      next()
    } catch (err) {
      next(err)
    }
  })

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`)

    makeAdaptor(socket, {
      joinGame: joinGameListener,
      disconnect: leavePlayerListener
    })
  })
}

export default makeSocketServer
