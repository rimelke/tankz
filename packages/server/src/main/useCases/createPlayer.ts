import makeBcryptHashProvider from '@providers/implementations/bcryptHashProvider'
import makeMemoryPlayerRepository from '@tests/repositories/memoryPlayerRepository'
import makeCreatePlayer from '@useCases/createPlayer'

const bcryptHashProvider = makeBcryptHashProvider()

const memoryPlayerRepository = makeMemoryPlayerRepository()

const createPlayer = makeCreatePlayer({
  hashProvider: bcryptHashProvider,
  playerRepository: memoryPlayerRepository
})

export { createPlayer }
