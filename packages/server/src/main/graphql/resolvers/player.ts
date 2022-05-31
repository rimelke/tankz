import { createPlayer } from '@main/useCases/createPlayer'
import { loginPlayer } from '@main/useCases/loginPlayer'

export default {
  Mutation: {
    createPlayer: (_, { nickname, password }) =>
      createPlayer({ nickname, password }),
    loginPlayer: (_, { nickname, password }) =>
      loginPlayer({ nickname, password })
  }
}
