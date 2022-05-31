import { createGame } from '@main/useCases/createGame'

export default {
  Mutation: {
    createGame: (_, data) => createGame(data)
  }
}
