import GameRepository from '@repositories/GameRepository'

interface IMakeGetSavedGamesProps {
  gameRepository: GameRepository
}

const makeGetSavedGames = ({ gameRepository }: IMakeGetSavedGamesProps) => {
  const getSavedGames = (playerId: string) =>
    gameRepository.findByPlayerId(playerId)

  return getSavedGames
}

export default makeGetSavedGames
