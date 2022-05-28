import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const MenuContainer = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 5rem;
  gap: 3.5rem;
`

export const MenuItem = styled.li`
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`
export const CustomLink = styled(Link)`
  text-decoration: none;
  color: unset;
`
