import { gameProvider } from '@main/providers/gameProvider'
import makeLeavePlayer from '@useCases/leavePlayer'

const leavePlayer = makeLeavePlayer({
  gameProvider
})

export { leavePlayer }
