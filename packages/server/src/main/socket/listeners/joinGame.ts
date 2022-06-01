import { joinPlayerInGame } from '@main/useCases/joinPlayerInGame'
import { ISocketListener } from '../adaptor'

const joinGameListener: ISocketListener = async (socket, gameId) => {
  const { tank, player, game } = await joinPlayerInGame({
    gameId,
    playerId: socket.data.playerId
  })

  socket.join(gameId)
  socket.to(gameId).emit('playerJoined', {
    id: player.id,
    nickname: player.nickname,
    state: tank.getState()
  })
  socket.data.gameId = gameId
  socket.emit('setup', {
    state: game.instance.getState(),
    id: player.id,
    map: game.map
  })
}

export default joinGameListener
