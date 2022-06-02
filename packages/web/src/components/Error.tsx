import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Button from './Button'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2.5rem;
  padding-top: 7rem;
`

const Text = styled.span`
  font-size: 1.1rem;
`

interface IErrorProps {
  children: ReactNode
}

const Error = ({ children }: IErrorProps) => {
  const navigate = useNavigate()

  return (
    <Container>
      <Text>err: {children}</Text>
      <Button onClick={() => navigate(-1)}>back</Button>
    </Container>
  )
}

export default Error
