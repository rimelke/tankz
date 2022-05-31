import AppError from '@errors/AppError'
import { IValidator } from '..'

const regex: IValidator = (key, value, arg: RegExp) => {
  if (typeof value === 'string' && !arg.test(value))
    throw new AppError(`${key} must match ${arg.toString()}`)

  return value
}

export default regex
