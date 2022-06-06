import styled from 'styled-components'

export const EndGameContainer = styled.div`
  padding-top: 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`

export const Container = styled.div`
  margin-bottom: 2rem;

  display: grid;
  grid-template-columns: 4rem 1fr 4rem;
  grid-template-rows: auto 1fr;
  gap: 1rem;
`

export const UpContainer = styled.div`
  grid-column-start: 2;
  display: flex;
  justify-content: space-between;
`

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  font-size: 0.8rem;
  align-items: flex-end;
  gap: 0.5rem;
`

export const MapContainer = styled.div`
  border: 10px solid black;

  grid-row-start: 2;
  grid-column-start: 2;
`

export const HealthContainer = styled.div`
  grid-row-start: 2;
  grid-column-start: 3;
  border: 10px solid black;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

export const HealthBar = styled.figure`
  background: green;
`
