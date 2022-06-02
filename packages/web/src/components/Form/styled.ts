import styled from 'styled-components'

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

export const CustomInput = styled.input`
  width: 100%;
  border: 3px solid black;
  outline: none;
  padding: 0.2rem;
  font-size: 0.8rem;
  font-weight: 600;
`

export const Label = styled.label`
  font-size: 0.7rem;
  font-weight: 600;
`

export const Error = styled.span`
  font-size: 0.6rem;
  color: red;
`
