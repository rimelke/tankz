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
      schema[key].forEach((validatorName: ISchema) => {
        data[key] = validators[
          typeof validatorName === 'string' ? validatorName : validatorName.type
        ](
          key,
          data[key],
          typeof validatorName === 'string' ? undefined : validatorName.value
        )
      })
    })

    return data
  }

  return { validate, schema }
}

export default makeValidator
