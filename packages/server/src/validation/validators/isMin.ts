import AppError from '@errors/AppError'
import { IValidator } from '..'

const isMin: IValidator = (key, value, arg: number) => {
  if (typeof value === 'number' && value < arg)
    throw new AppError(`${key} must be greater than ${arg}`)

  if (typeof value === 'string' && value.length < arg)
    throw new AppError(`${key} length must be greater than ${arg}`)

  return value
}

export default isMin
