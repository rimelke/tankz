import makeCreateGame from '@useCases/createGame'
import makeMemoryGameRepository from '@tests/repositories/memoryGameRepository'
import makeMemoryPlayerRepository from '@tests/repositories/memoryPlayerRepository'
import makeCreateGameValidator from '@useCases/createGame/validation'
import * as maps from '@tankz/game/maps'
import { Player } from '@entities/player'
import makeCreatePlayer from '@useCases/createPlayer'
import makeBcryptHashProvider from '@providers/implementations/bcryptHashProvider'

describe('createGame', () => {
  const gameRepository = makeMemoryGameRepository()
  const playerRepository = makeMemoryPlayerRepository()
  const createGame = makeCreateGame({ gameRepository, playerRepository })
  let player: Player

  beforeAll(async () => {
    const hashProvider = makeBcryptHashProvider()
    const createPlayer = makeCreatePlayer({ playerRepository, hashProvider })

    player = await createPlayer({ nickname: 'player', password: 'abcd1234' })
  })

  describe('validation', () => {
    const validator = makeCreateGameValidator()

    it('should contain map schema', () => {
      expect(validator.schema.map).toBeDefined()
      expect(validator.schema.map.length).toBe(3)
      expect(validator.schema.map[0]).toBe('isRequired')
      expect(validator.schema.map[1]).toBe('isString')
      expect(validator.schema.map[2]).toEqual({
        type: 'isIn',
        value: Object.keys(maps)
      })
    })

    it('should contain playerId schema', () => {
      expect(validator.schema.playerId).toBeDefined()
      expect(validator.schema.playerId.length).toBe(2)
      expect(validator.schema.playerId[0]).toBe('isRequired')
      expect(validator.schema.playerId[1]).toBe('isString')
    })
  })

  it('should create a game', async () => {
    const game = await createGame({
      map: 'map1',
      playerId: player.id
    })

    expect(game).toHaveProperty('id')
    expect(game.players).toHaveLength(1)
    expect(game.players.includes(player)).toBeTruthy()
    expect(game.map).toBe('map1')
  })
})
