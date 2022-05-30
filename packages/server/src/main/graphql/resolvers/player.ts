import { createPlayer } from '@main/useCases/createPlayer'

export default {
  Mutation: {
    createPlayer: (_, { nickname, password }) =>
      createPlayer({ nickname, password })
  }
}
