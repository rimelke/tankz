import makeValidator from '@validation/index'
import { ILeavePlayerDTO } from '.'

const makeLeavePlayerValidator = () =>
  makeValidator<ILeavePlayerDTO>({
    playerId: ['isRequired', 'isString']
  })

export default makeLeavePlayerValidator
