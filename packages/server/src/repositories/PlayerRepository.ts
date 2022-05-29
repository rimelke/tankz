import { Player } from '@entities/player'

interface PlayerRepository {
  create(data: Omit<Player, 'id'>): Promise<Player>
}

export default PlayerRepository
