import AppError from '@errors/AppError'
import { IValidator } from '..'

const isString: IValidator = (key, value) => {
  if (value && typeof value !== 'string')
    throw new AppError(`${key} must be a string`)

  return value
}

export default isString
