import GameProvider from '@providers/GameProvider'
import makeLeavePlayerValidator from './validation'

export interface ILeavePlayerDTO {
  playerId: string
}

interface IMakeLeavePlayerProps {
  gameProvider: GameProvider
}

const makeLeavePlayer = ({ gameProvider }: IMakeLeavePlayerProps) => {
  const leavePlayer = ({ playerId }: ILeavePlayerDTO) => {
    gameProvider.removePlayer(playerId)
  }

  const leavePlayerValidator = makeLeavePlayerValidator()

  const leavePlayerController = (data: ILeavePlayerDTO) => {
    const validatedData = leavePlayerValidator.validate(data)

    return leavePlayer(validatedData)
  }

  return leavePlayerController
}

export default makeLeavePlayer
