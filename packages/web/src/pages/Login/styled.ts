import { Form } from '@unform/web'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  gap: 6rem;
  margin-top: 2rem;
`

export const Content = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 16rem;
  gap: 1.5rem;
  padding: 2rem 0;
`

export const Divisor = styled.figure`
  background: black;
  width: 5px;
`

export const ContentTitle = styled.h2`
  font-size: 1rem;
`

export const ErrorMessage = styled.span`
  font-size: 0.6rem;
  color: red;
`

export const SuccessMessage = styled.span`
  font-size: 0.6rem;
  color: green;
`
