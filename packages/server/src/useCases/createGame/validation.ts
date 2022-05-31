import makeValidator from '@validation/index'
import { ICreateGameDTO } from '.'
import * as maps from '@tankz/game/maps'

const makeCreateGameValidator = () =>
  makeValidator<ICreateGameDTO>({
    map: [
      'isRequired',
      'isString',
      {
        type: 'isIn',
        value: Object.keys(maps)
      }
    ]
  })

export default makeCreateGameValidator
