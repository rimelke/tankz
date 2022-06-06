import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const GameList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`

export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 0.7rem;
  border-top: 4px solid black;

  &:nth-child(1) {
    border-top: none;
    padding-top: 0;
  }
`

export const GameContent = styled.div`
  display: flex;
  gap: 2rem;
`

export const MapContainer = styled.div`
  width: 10rem;
  border: 5px solid #000;
`

export const PlayerList = styled.ul`
  list-style: none;
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`

export const GameId = styled.span`
  font-size: 0.7rem;
`

export const JoinButton = styled(Link)`
  background-color: #000;
  color: #fff;
  padding: 0.8rem;
  align-self: flex-end;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  margin-left: 2rem;

  &:hover {
    transform: scale(1.1);
  }
`
