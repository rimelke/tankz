import GameProvider from '@providers/GameProvider'

interface IMakeGetRunningGamesProps {
  gameProvider: GameProvider
}

const makeGetRunningGames = ({ gameProvider }: IMakeGetRunningGamesProps) => {
  const getRunningGames = () => gameProvider.getRunningGames()

  return getRunningGames
}

export default makeGetRunningGames
