import makeMongoGameRepository from '@repositories/implementations/mongoGameRepository'
import makeMongoPlayerRepository from '@repositories/implementations/mongoPlayerRepository'
import makeCreateGame from '@useCases/createGame'

const mongoPlayerRepository = makeMongoPlayerRepository()
const mongoGameRepository = makeMongoGameRepository()

const createGame = makeCreateGame({
  playerRepository: mongoPlayerRepository,
  gameRepository: mongoGameRepository
})

export { createGame }
