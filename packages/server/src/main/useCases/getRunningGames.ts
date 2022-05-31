import makeGetRunningGames from '@useCases/getRunningGames'
import { gameProvider } from '@main/providers/gameProvider'

const getRunningGames = makeGetRunningGames({ gameProvider })

export { getRunningGames }
