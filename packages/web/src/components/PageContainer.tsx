import { ReactNode } from 'react'
import styled from 'styled-components'
import Back from './Back'
import Logout from './Logout'
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
  padding-bottom: 2rem;
  justify-content: space-between;
  height: 100%;
  gap: 2rem;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
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
    <ContentContainer>
      {includeBackButton && <Back />}
      <Content>
        <Title>{title}</Title>
        {children}
      </Content>
    </ContentContainer>
    <Logout />
  </Container>
)

export default PageContainer
