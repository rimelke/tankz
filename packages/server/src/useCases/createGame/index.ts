import GameRepository from '@repositories/GameRepository'
import PlayerRepository from '@repositories/PlayerRepository'
import * as maps from '@tankz/game/maps'

interface IMakeCreateGameProps {
  gameRepository: GameRepository
  playerRepository: PlayerRepository
}

export interface ICreateGameDTO {
  map: keyof typeof maps
  playerId: string
}

const makeCreateGame = ({
  gameRepository,
  playerRepository
}: IMakeCreateGameProps) => {
  const createGame = async (data: ICreateGameDTO) => {
    const player = await playerRepository.findById(data.playerId)

    if (!player) throw new Error('player not found')

    const game = await gameRepository.create({
      map: data.map,
      players: [player]
    })

    return game
  }

  return createGame
}

export default makeCreateGame
