import makeMemoryPlayerRepository from '@tests/repositories/memoryPlayerRepository'
import makeBcryptHashProvider from '@providers/implementations/bcryptHashProvider'
import makeJwtTokenProvider from '@providers/implementations/jwtTokenProvider'
import makeLoginPlayer, { ILoginPlayerDTO } from '@useCases/loginPlayer'
import makeLoginPlayerValidator from '@useCases/loginPlayer/validation'
import makeCreatePlayer from '@useCases/createPlayer'

describe('loginPlayer', () => {
  const playerRepository = makeMemoryPlayerRepository()
  const hashProvider = makeBcryptHashProvider()
  const tokenProvider = makeJwtTokenProvider()
  const loginPlayer = makeLoginPlayer({
    playerRepository,
    hashProvider,
    tokenProvider
  })

  describe('validation', () => {
    const loginPlayerValidator = makeLoginPlayerValidator()

    it('should contain nickname schema', () => {
      expect(loginPlayerValidator.schema.nickname).toBeDefined()
      expect(loginPlayerValidator.schema.nickname.length).toBe(2)
      expect(loginPlayerValidator.schema.nickname[0]).toBe('isRequired')
      expect(loginPlayerValidator.schema.nickname[1]).toBe('isString')
    })

    it('should contain password schema', () => {
      expect(loginPlayerValidator.schema.password).toBeDefined()
      expect(loginPlayerValidator.schema.password.length).toBe(2)
      expect(loginPlayerValidator.schema.password[0]).toBe('isRequired')
      expect(loginPlayerValidator.schema.password[1]).toBe('isString')
    })
  })

  it('should create a player', async () => {
    const data: ILoginPlayerDTO = {
      nickname: 'testnickname',
      password: 'abcd1234'
    }

    const createPlayer = makeCreatePlayer({
      playerRepository,
      hashProvider
    })

    const { id } = await createPlayer(data)

    const result = await loginPlayer(data)

    expect(result.token).toBeDefined()
    expect(await tokenProvider.validate(result.token)).toBe(id)
  })
})
