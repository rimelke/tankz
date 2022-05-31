import { createGame } from '@main/useCases/createGame'
import { ISocketListener } from '../adaptor'

const createGameListener: ISocketListener = async (socket, data) => {
  const { id } = await createGame({ ...data, playerId: socket.data.playerId })

  console.log(`[Socket.io] New game created: ${id}`)

  socket.join(id)
}

export default createGameListener
