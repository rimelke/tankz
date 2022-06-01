import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

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

export const CustomLink = styled.span`
  text-decoration: none;
  color: #ffffff;
  background: black;
  transition: all 0.2s ease-in-out;
  padding: 0.8rem;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`

interface IErrorProps {
  children: ReactNode
}

const Error = ({ children }: IErrorProps) => {
  const navigate = useNavigate()

  return (
    <Container>
      <Text>err: {children}</Text>
      <CustomLink onClick={() => navigate(-1)}>back</CustomLink>
    </Container>
  )
}

export default Error
