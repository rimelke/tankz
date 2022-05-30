import { ICreatePlayerDTO } from '@useCases/createPlayer'
import makeValidator from '@validation/index'

const makeCreatePlayerValidator = () =>
  makeValidator<ICreatePlayerDTO>({
    nickname: ['isRequired', 'isString', { type: 'isMin', value: 5 }],
    password: ['isRequired', 'isString', { type: 'isMin', value: 8 }]
  })

export default makeCreatePlayerValidator
