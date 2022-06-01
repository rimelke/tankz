import styled from 'styled-components'
import { ArrowSmLeftIcon } from '@heroicons/react/solid'
import { useNavigate } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  align-self: flex-start;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease-in-out;
  position: relative;
  z-index: 1;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`

const Back = () => {
  const navigate = useNavigate()

  return (
    <Container onClick={() => navigate(-1)}>
      <ArrowSmLeftIcon width="1.5rem" />
      <span>back</span>
    </Container>
  )
}

export default Back
