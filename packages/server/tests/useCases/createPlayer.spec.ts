import makeMemoryPlayerRepository from '@tests/repositories/memoryPlayerRepository'
import makeCreatePlayer, { ICreatePlayerDTO } from '@useCases/createPlayer'
import makeBcryptHashProvider from '@providers/implementations/bcryptHashProvider'

describe('createPlayer', () => {
  const playerRepository = makeMemoryPlayerRepository()
  const hashProvider = makeBcryptHashProvider()
  const createPlayer = makeCreatePlayer({ playerRepository, hashProvider })

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
