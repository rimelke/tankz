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
    },
    async findByNickname(nickname) {
      return players.find((player) => player.nickname === nickname)
    },
    async findById(id) {
      return players.find((player) => player.id === id)
    }
  }

  return memoryPlayerRepository
}

export default makeMemoryPlayerRepository
