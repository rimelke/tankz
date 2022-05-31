import makeMongoPlayerRepository from '@repositories/implementations/mongoPlayerRepository'
import makeJoinPlayerInGame from '@useCases/joinPlayerInGame'
import { gameProvider } from '@main/providers/gameProvider'

const mongoPlayerRepository = makeMongoPlayerRepository()

const joinPlayerInGame = makeJoinPlayerInGame({
  playerRepository: mongoPlayerRepository,
  gameProvider
})

export { joinPlayerInGame }
