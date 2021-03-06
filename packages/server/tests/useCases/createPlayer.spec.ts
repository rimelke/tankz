import makeMemoryPlayerRepository from '@tests/repositories/memoryPlayerRepository'
import makeCreatePlayer, { ICreatePlayerDTO } from '@useCases/createPlayer'
import makeBcryptHashProvider from '@providers/implementations/bcryptHashProvider'
import makeCreatePlayerValidator from '@useCases/createPlayer/validation'

describe('createPlayer', () => {
  const playerRepository = makeMemoryPlayerRepository()
  const hashProvider = makeBcryptHashProvider()
  const createPlayer = makeCreatePlayer({ playerRepository, hashProvider })

  describe('validation', () => {
    const createPlayerValidator = makeCreatePlayerValidator()

    it('should contain nickname schema', () => {
      expect(createPlayerValidator.schema.nickname).toBeDefined()
      expect(createPlayerValidator.schema.nickname.length).toBe(5)
      expect(createPlayerValidator.schema.nickname[0]).toBe('isRequired')
      expect(createPlayerValidator.schema.nickname[1]).toBe('isString')
      expect(createPlayerValidator.schema.nickname[2]).toBe('trim')
      expect(createPlayerValidator.schema.nickname[3]).toEqual({
        type: 'isMin',
        value: 5
      })
      expect(createPlayerValidator.schema.nickname[4]).toEqual({
        type: 'regex',
        value: /^\S+$/
      })
    })

    it('should contain password schema', () => {
      expect(createPlayerValidator.schema.password).toBeDefined()
      expect(createPlayerValidator.schema.password.length).toBe(3)
      expect(createPlayerValidator.schema.password[0]).toBe('isRequired')
      expect(createPlayerValidator.schema.password[1]).toBe('isString')
      expect(createPlayerValidator.schema.password[2]).toEqual({
        type: 'isMin',
        value: 8
      })
    })
  })

  it('should not create player with a nickname already in use', async () => {
    const nickname = 'nickname'
    const password = 'password'

    await createPlayer({ nickname, password })

    expect(createPlayer({ nickname, password })).rejects.toThrow(
      'nickname already in use'
    )
  })

  it('should create a player', async () => {
    const data: ICreatePlayerDTO = {
      nickname: 'testnickname',
      password: 'abcd1234'
    }

    const player = await createPlayer(data)

    expect(player.nickname).toBe(data.nickname)
    expect(player.password).not.toBe(data.password)
    expect(await hashProvider.compare(data.password, player.password)).toBe(
      true
    )
  })
})
