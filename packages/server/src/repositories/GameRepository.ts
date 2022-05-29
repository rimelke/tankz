import { Game } from '../entities/game'

interface GameRepository {
  create(game: Omit<Game, 'id'>): Promise<Game>
}

export default GameRepository
