import * as validators from './validators'

export type IValidator = <T>(key: string, data: any, value?: any) => T

type ISchema =
  | keyof typeof validators
  | {
      type: keyof typeof validators
      value: any
    }

const makeValidator = <T>(schema: Record<keyof T, ISchema[]>) => {
  const validate = (data: T) => {
    Object.keys(schema).forEach((key) => {
      schema[key].forEach((validatorName: keyof typeof validators) => {
        data[key] = validators[validatorName](key, data[key])
      })
    })

    return data
  }

  return { validate, schema }
}

export default makeValidator
