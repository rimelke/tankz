import { ICreatePlayerDTO } from '@useCases/createPlayer'
import makeValidator from '@validation/index'

const makeCreatePlayerValidator = () =>
  makeValidator<ICreatePlayerDTO>({
    nickname: [
      'isRequired',
      'isString',
      'trim',
      { type: 'isMin', value: 5 },
      {
        type: 'regex',
        value: /^\S+$/
      }
    ],
    password: ['isRequired', 'isString', { type: 'isMin', value: 8 }]
  })

export default makeCreatePlayerValidator
