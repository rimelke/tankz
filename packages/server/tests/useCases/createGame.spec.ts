import makeCreateGame from '@useCases/createGame'
import makeMemoryGameRepository from '@tests/repositories/memoryGameRepository'

describe('createGame', () => {
  it('should create a game', async () => {
    const gameRepository = makeMemoryGameRepository()
    const createGame = makeCreateGame({ gameRepository })

    const game = await createGame({
      map: 'map1',
      playerId: 'player1'
    })

    expect(game).toHaveProperty('id')
    expect(game.map).toBe('map1')
    expect(game.players).toHaveLength(1)
  })
})
