import AppError from '@errors/AppError'
import { IValidator } from '@validation/index'

const isRequired: IValidator = (key, oldValue) => {
  if (!oldValue) throw new AppError(`${key} is required`)

  return oldValue
}

export default isRequired
