import { ReactNode } from 'react'
import styled from 'styled-components'
import Back from './Back'

interface PageContainerProps {
  children: ReactNode
  includeBackButton?: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

const PageContainer = ({
  children,
  includeBackButton = true
}: PageContainerProps) => (
  <Container>
    {includeBackButton && <Back />}
    {children}
  </Container>
)

export default PageContainer
