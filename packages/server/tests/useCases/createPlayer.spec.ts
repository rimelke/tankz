import makeMemoryPlayerRepository from '@tests/repositories/memoryPlayerRepository'
import makeCreatePlayer, { ICreatePlayerDTO } from '@useCases/createPlayer'
import makeBcryptHashProvider from '@providers/implementations/bcryptHashProvider'

describe('createPlayer', () => {
  const playerRepository = makeMemoryPlayerRepository()
  const hashProvider = makeBcryptHashProvider()
  const createPlayer = makeCreatePlayer({ playerRepository, hashProvider })

  it('should not create a player if nickname is not provided', async () => {
    const data = {
      password: '123456'
    }

    expect(createPlayer(data as ICreatePlayerDTO)).rejects.toThrow(
      'nickname is required'
    )
  })

  it('should not create a player if password is not provided', async () => {
    const data = {
      nickname: 'nickname'
    }

    expect(createPlayer(data as ICreatePlayerDTO)).rejects.toThrow(
      'password is required'
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
