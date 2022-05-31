import makeMemoryGameProvider from '@providers/implementations/memoryGameProvider'
import makeCreateGame from '@useCases/createGame'

const memoryGameProvider = makeMemoryGameProvider()

const createGame = makeCreateGame({
  gameProvider: memoryGameProvider
})

export { createGame }
