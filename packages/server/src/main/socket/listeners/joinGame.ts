import { joinPlayerInGame } from '@main/useCases/joinPlayerInGame'
import { ISocketListener } from '../adaptor'

const joinGameListener: ISocketListener = async (socket, gameId) => {
  const { game } = await joinPlayerInGame({
    gameId,
    playerId: socket.data.playerId
  })

  socket.data.gameId = gameId
  socket.emit('setup', {
    state: game.instance.getState(),
    id: socket.data.playerId,
    map: game.map
  })

  game.instance.subscribe((event) => {
    socket.emit(event.type, event.payload)
  })

  // socket.join(gameId)
  // // socket.to(gameId).emit('playerJoined', {
  // //   id: player.id,
  // //   nickname: player.nickname,
  // //   state: tank.getState()
  // // })
  // socket.data.gameId = gameId
  // socket.emit('setup', {
  //   state: game.instance.getState(),
  //   id: player.id,
  //   map: game.map
  // })
}

export default joinGameListener
