import { Game } from '@entities/game'
import GameRepository from '@repositories/GameRepository'
import { nanoid } from 'nanoid'

const makeMemoryGameRepository = (): GameRepository => {
  const games: Game[] = []

  const memoryGameRepository: GameRepository = {
    async create(data) {
      const game: Game = {
        ...data,
        id: nanoid()
      }

      games.push(game)

      return game
    }
  }

  return memoryGameRepository
}

export default makeMemoryGameRepository
