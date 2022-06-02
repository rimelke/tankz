import { FormHandles } from '@unform/core'
import * as yup from 'yup'

const validateForm = async (
  data: any,
  schema: yup.AnySchema,
  form: FormHandles
) => {
  try {
    form.setErrors({})

    return await schema.validate(data, {
      abortEarly: false
    })
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const validationErrors = {}

      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message
      })

      form.setErrors(validationErrors)
    } else {
      console.error(err)
    }
  }
}

export default validateForm
