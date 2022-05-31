import makeCreateGame from '@useCases/createGame'
import { gameProvider } from '@main/providers/gameProvider'

const createGame = makeCreateGame({
  gameProvider
})

export { createGame }
