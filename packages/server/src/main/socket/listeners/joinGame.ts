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
    status: game.instance.state.status,
    countdown: game.instance.getCountdown(),
    id: socket.data.playerId,
    map: game.map
  })

  const tank = game.instance.state.tanks.find(
    (tank) => tank.id === socket.data.playerId
  )

  socket.on('action', (data) => {
    tank.makeAction(data)
  })

  game.instance.subscribe((event) => {
    socket.emit(event.type, event.payload)
  })
}

export default joinGameListener
