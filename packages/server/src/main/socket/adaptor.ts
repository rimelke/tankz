import { Socket } from 'socket.io'

export type ISocketListener = (
  socket: Socket,
  ...params: any[]
) => Promise<void>

const makeAdaptor = (
  socket: Socket,
  listeners: Record<string, ISocketListener>
) => {
  Object.entries(listeners).forEach(([event, listener]) => {
    socket.on(event, async (...params) => {
      try {
        await listener(socket, ...params)
      } catch (err) {
        socket.emit('error', { message: err.message, event })
      }
    })
  })
}

export default makeAdaptor
