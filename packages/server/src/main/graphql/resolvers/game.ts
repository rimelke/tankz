import { createGame } from '@main/useCases/createGame'
import { getRunningGames } from '@main/useCases/getRunningGames'
import { getSavedGames } from '@main/useCases/getSavedGames'

export default {
  Query: {
    getRunningGames,
    getSavedGames: (_, _data, { playerId }) => getSavedGames(playerId)
  },
  Mutation: {
    createGame: (_, data) => createGame(data)
  }
}
