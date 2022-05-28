import { ReactNode } from 'react'
import { CustomTitle } from './styled'

interface TitleProps {
  children: ReactNode
}

const Title = ({ children }: TitleProps) => (
  <CustomTitle>{children}</CustomTitle>
)

export default Title
