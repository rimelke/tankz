import { IValidator } from '@validation/index'

const isRequired: IValidator = () => (key, oldValue) => {
  if (!oldValue) throw new Error(`${key} is required`)

  return oldValue
}

export default isRequired
