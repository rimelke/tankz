import makeBcryptHashProvider from '@providers/implementations/bcryptHashProvider'
import makeMongoPlayerRepository from '@repositories/implementations/mongoPlayerRepository'
import makeCreatePlayer from '@useCases/createPlayer'

const bcryptHashProvider = makeBcryptHashProvider()

const mongoPlayerRepository = makeMongoPlayerRepository()

const createPlayer = makeCreatePlayer({
  hashProvider: bcryptHashProvider,
  playerRepository: mongoPlayerRepository
})

export { createPlayer }
