import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

export const CustomButton = styled.span`
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`

const Logout = () => {
  const { logout, nickname, isAuthenticated } = useAuth()

  return (
    isAuthenticated && (
      <Container>
        <span>logged as: {nickname}</span>
        <CustomButton onClick={logout}>logout</CustomButton>
      </Container>
    )
  )
}

export default Logout
