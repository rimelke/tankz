import { leavePlayer } from '@main/useCases/leavePlayer'
import { ISocketListener } from '../adaptor'

const leavePlayerListener: ISocketListener = async (socket) => {
  console.log(`[Socket.io] Client disconnected: ${socket.id}`)

  leavePlayer({ playerId: socket.data.playerId })
  socket
    .to(socket.data.gameId)
    .emit('playerLeaved', { playerId: socket.data.playerId })
}

export default leavePlayerListener
