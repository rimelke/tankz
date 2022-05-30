import { Player } from '@entities/player'

interface PlayerRepository {
  create(data: Omit<Player, 'id'>): Promise<Player>
  findByNickname(nickname: string): Promise<Player | undefined>
  findById(id: string): Promise<Player | undefined>
}

export default PlayerRepository
