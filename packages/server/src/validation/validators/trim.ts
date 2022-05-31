import { IValidator } from '..'

const trim: IValidator = (_, value) => {
  if (typeof value === 'string') return value.trim()

  return value
}

export default trim
