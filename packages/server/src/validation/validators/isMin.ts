import { IValidator } from '..'

const isMin: IValidator = (key, value, arg: number) => {
  if (typeof value === 'number' && value < arg)
    throw new Error(`${key} must be greater than ${arg}`)

  if (typeof value === 'string' && value.length < arg)
    throw new Error(`${key} length must be greater than ${arg}`)

  return value
}

export default isMin
