import makeCreateGame from '@useCases/createGame'
import makeCreateGameValidator from '@useCases/createGame/validation'
import * as maps from '@tankz/game/maps'
import makeMemoryGameProvider from '@providers/implementations/memoryGameProvider'

describe('createGame', () => {
  const gameProvider = makeMemoryGameProvider()
  const createGame = makeCreateGame({ gameProvider })

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
  })

  it('should create a game', async () => {
    const game = await createGame({
      map: 'map1'
    })

    expect(game).toHaveProperty('id')
    expect(game.players).toHaveLength(0)
    expect(game.map).toBe('map1')
  })
})
