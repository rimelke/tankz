import { createGame } from '@main/useCases/createGame'

export default {
  Mutation: {
    createGame: (_, data, { playerId }) => createGame({ ...data, playerId })
  }
}
