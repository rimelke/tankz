import GameRepository from '../repositories/GameRepository'
import * as maps from '@tankz/game/maps'

interface IMakeCreateGameProps {
  gameRepository: GameRepository
}

export interface ICreateGameDTO {
  map: keyof typeof maps
  playerId: string
}

const makeCreateGame = ({ gameRepository }: IMakeCreateGameProps) => {
  const createGame = async (data: ICreateGameDTO) => {
    const game = await gameRepository.create({
      map: data.map,
      players: []
    })

    return game
  }

  return createGame
}

export default makeCreateGame
