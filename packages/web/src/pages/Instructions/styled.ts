import styled from 'styled-components'

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

export const ContentTitle = styled.h3`
  font-size: 1.2rem;
`

export const Line = styled.div`
  display: flex;
  gap: 0.3rem;
  align-items: center;
`

export const MoveKeyboard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
`

export const Key = styled.div`
  border: 0.2rem solid black;
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const MidText = styled.span`
  margin: 0 1.5rem;
`

export const LargeKey = styled(Key)`
  width: 12rem;
`

export const BackgroundCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`
