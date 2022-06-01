import AppError from '@errors/AppError'
import GameProvider from '@providers/GameProvider'
import PlayerRepository from '@repositories/PlayerRepository'
import makeJoinPlayerInGameValidator from './validation'

export interface IJoinPlayerInGameDTO {
  gameId: string
  playerId: string
}

interface IMakeJoinPlayerInGameProps {
  gameProvider: GameProvider
  playerRepository: PlayerRepository
}

const makeJoinPlayerInGame = ({
  gameProvider,
  playerRepository
}: IMakeJoinPlayerInGameProps) => {
  const joinPlayerInGame = async ({
    gameId,
    playerId
  }: IJoinPlayerInGameDTO) => {
    const player = await playerRepository.findById(playerId)

    if (!player) throw new AppError('player not found')

    const tank = gameProvider.addPlayer(gameId, player)
    const game = gameProvider.getGame(gameId)

    return { tank, player, game }
  }

  const validator = makeJoinPlayerInGameValidator()

  const joinPlayerInGameController = (data: IJoinPlayerInGameDTO) => {
    const validatedData = validator.validate(data)

    return joinPlayerInGame(validatedData)
  }

  return joinPlayerInGameController
}

export default makeJoinPlayerInGame
