import { leavePlayer } from '@main/useCases/leavePlayer'
import { ISocketListener } from '../adaptor'

const leavePlayerListener: ISocketListener = async (socket) => {
  console.log(`[Socket.io] Client disconnected: ${socket.id}`)

  const { game } = leavePlayer({ playerId: socket.data.playerId })

  game.instance.unsubscribe((event) => {
    socket.emit(event.type, event.payload)
  })
}

export default leavePlayerListener
