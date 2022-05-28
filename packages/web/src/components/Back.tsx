import styled from 'styled-components'
import { ArrowSmLeftIcon } from '@heroicons/react/solid'
import { Link } from 'react-router-dom'

const Container = styled(Link)`
  display: flex;
  align-self: flex-start;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: unset;
  transition: all 0.2s ease-in-out;
  position: relative;
  z-index: 1;

  &:hover {
    transform: scale(1.1);
  }
`

const Back = () => (
  <Container to="/">
    <ArrowSmLeftIcon width="1.5rem" />
    <span>back</span>
  </Container>
)

export default Back
