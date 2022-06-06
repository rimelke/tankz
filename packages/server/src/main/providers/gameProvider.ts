import makeMemoryGameProvider from '@providers/implementations/memoryGameProvider'
import makeMongoGameRepository from '@repositories/implementations/mongoGameRepository'

const mongoGameRepository = makeMongoGameRepository()

const gameProvider = makeMemoryGameProvider({
  gameRepository: mongoGameRepository
})

export { gameProvider }
