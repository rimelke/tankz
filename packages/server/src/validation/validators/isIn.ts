import { IValidator } from '..'

const isIn: IValidator = (key, value, arg: any[]) => {
  if (!arg.includes(value))
    throw new Error(`${key} must be one of ${arg.join(', ')}`)

  return value
}

export default isIn
