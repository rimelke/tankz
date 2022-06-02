import { joinPlayerInGame } from '@main/useCases/joinPlayerInGame'
import { ISocketListener } from '../adaptor'

const joinGameListener: ISocketListener = async (socket, gameId) => {
  const { game } = await joinPlayerInGame({
    gameId,
    playerId: socket.data.playerId
  })

  console.log(
    'game.instance.state.tanks',
    game.instance.state.tanks.map((tank) => ({
      id: tank.id,
      pos: tank.state.position
    }))
  )

  console.log(
    'game.instance.getState().tanks',
    game.instance.getState().tanks.map((tank) => ({
      id: tank.id,
      pos: tank.state.position
    }))
  )

  socket.data.gameId = gameId
  socket.emit('setup', {
    state: game.instance.getState(),
    id: socket.data.playerId,
    map: game.map
  })

  // socket.on('tank', ({ type, payload }) => {
  //   const tank = game.instance.state.tanks.find(
  //     (tank) => tank.id === socket.data.playerId
  //   )

  //   tank[type](payload)

  //   console.log('position', tank.state.position)
  // })

  const tank = game.instance.state.tanks.find(
    (tank) => tank.id === socket.data.playerId
  )

  socket.on('action', (data) => {
    tank.makeAction(data)
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
