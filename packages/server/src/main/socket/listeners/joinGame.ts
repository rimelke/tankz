import { joinPlayerInGame } from '@main/useCases/joinPlayerInGame'
import { ISocketListener } from '../adaptor'

const joinGameListener: ISocketListener = async (socket, gameId) => {
  const { tank, player } = await joinPlayerInGame({
    gameId,
    playerId: socket.data.playerId
  })

  socket.join(gameId)
  socket.to(gameId).emit('playerJoined', {
    id: tank.id,
    nickname: player.nickname,
    state: tank.state
  })
  socket.data.gameId = gameId
}

export default joinGameListener
