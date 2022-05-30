import { ILoginPlayerDTO } from '@useCases/loginPlayer'
import makeValidator from '@validation/index'

const makeLoginPlayerValidator = () =>
  makeValidator<ILoginPlayerDTO>({
    nickname: ['isRequired', 'isString'],
    password: ['isRequired', 'isString']
  })

export default makeLoginPlayerValidator
