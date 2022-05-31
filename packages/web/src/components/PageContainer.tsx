import { ReactNode } from 'react'
import styled from 'styled-components'
import Back from './Back'
import Title from './Title'

interface PageContainerProps {
  children: ReactNode
  includeBackButton?: boolean
  title: string
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`

const Content = styled.div`
  border: 0.4rem solid black;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5rem;
`

const PageContainer = ({
  children,
  includeBackButton = true,
  title
}: PageContainerProps) => (
  <Container>
    {includeBackButton && <Back />}
    <Content>
      <Title>{title}</Title>
      {children}
    </Content>
  </Container>
)

export default PageContainer
