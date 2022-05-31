import { Game } from '../entities/game'

interface GameRepository {
  save(game: Omit<Game, 'id'>): Promise<Game>
}

export default GameRepository
