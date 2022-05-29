type IValidationFunction = <T>(key: string, data: any) => T

export type IValidator = () => IValidationFunction

const makeValidator = <T>(schema: Record<keyof T, IValidationFunction[]>) => {
  const validate = (data: T) => {
    Object.keys(schema).forEach((key) => {
      schema[key].forEach((validationFunction: IValidationFunction) => {
        data[key] = validationFunction(key, data[key])
      })
    })

    return data
  }

  return { validate }
}

export default makeValidator
