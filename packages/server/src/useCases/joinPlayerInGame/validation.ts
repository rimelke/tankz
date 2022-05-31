import makeValidator from '@validation/index'
import { IJoinPlayerInGameDTO } from '.'

const makeJoinPlayerInGameValidator = () =>
  makeValidator<IJoinPlayerInGameDTO>({
    gameId: ['isRequired', 'isString'],
    playerId: ['isRequired', 'isString']
  })

export default makeJoinPlayerInGameValidator
