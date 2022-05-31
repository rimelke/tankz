import AppError from '@errors/AppError'
import GameRepository from '@repositories/GameRepository'
import PlayerRepository from '@repositories/PlayerRepository'
import * as maps from '@tankz/game/maps'
import makeCreateGameValidator from './validation'

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

    if (!player) throw new AppError('player not found')

    const game = await gameRepository.create({
      map: data.map,
      players: [player]
    })

    return game
  }

  const createGameValidator = makeCreateGameValidator()

  const createGameController = async (data: ICreateGameDTO) => {
    const validatedData = createGameValidator.validate(data)

    return createGame(validatedData)
  }

  return createGameController
}

export default makeCreateGame
