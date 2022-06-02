import { InputHTMLAttributes, useEffect, useRef } from 'react'
import { useField } from '@unform/core'
import { CustomInput, Error, InputContainer, Label } from './styled'

interface Props {
  name: string
  label?: string
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & Props

const Input = ({ name, label, ...rest }: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { fieldName, defaultValue, registerField, clearError, error } =
    useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => {
        return ref.current.value
      },
      setValue: (ref, value) => {
        ref.current.value = value
      },
      clearValue: (ref) => {
        ref.current.value = ''
      }
    })
  }, [fieldName, registerField])

  return (
    <InputContainer>
      {label && <Label>{label}</Label>}

      <CustomInput
        ref={inputRef}
        onFocus={clearError}
        defaultValue={defaultValue}
        {...rest}
      />

      {error && <Error>{error}</Error>}
    </InputContainer>
  )
}

export default Input
