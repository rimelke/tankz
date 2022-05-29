import { Player } from '@entities/player'
import PlayerRepository from '@repositories/PlayerRepository'
import { nanoid } from 'nanoid'

const makeMemoryPlayerRepository = () => {
  const players: Player[] = []

  const memoryPlayerRepository: PlayerRepository = {
    async create(data) {
      const player: Player = {
        id: nanoid(),
        ...data
      }

      players.push(player)

      return player
    }
  }

  return memoryPlayerRepository
}

export default makeMemoryPlayerRepository
