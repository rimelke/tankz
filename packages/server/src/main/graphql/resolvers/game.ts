import { createGame } from '@main/useCases/createGame'
import { getRunningGames } from '@main/useCases/getRunningGames'

export default {
  Query: {
    getRunningGames
  },
  Mutation: {
    createGame: (_, data) => createGame(data)
  }
}
