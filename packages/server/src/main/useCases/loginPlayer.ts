import makeBcryptHashProvider from '@providers/implementations/bcryptHashProvider'
import makeJwtTokenProvider from '@providers/implementations/jwtTokenProvider'
import makeMongoPlayerRepository from '@repositories/implementations/mongoPlayerRepository'
import makeLoginPlayer from '@useCases/loginPlayer'

const mongoPlayerRepository = makeMongoPlayerRepository()
const bcryptHashProvider = makeBcryptHashProvider()
const jwtTokenProvider = makeJwtTokenProvider()

const loginPlayer = makeLoginPlayer({
  hashProvider: bcryptHashProvider,
  playerRepository: mongoPlayerRepository,
  tokenProvider: jwtTokenProvider
})

export { loginPlayer }
