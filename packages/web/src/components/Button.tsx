import { ButtonHTMLAttributes, Fragment, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const CustomButton = styled.button`
  color: #ffffff;
  background: black;
  transition: all 0.2s ease-in-out;
  padding: 0.8rem;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`

export const CustomLink = styled(Link)``

interface IButtonProps {
  children: ReactNode
  link?: string
}

type IProps = IButtonProps & ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({ children, link, ...rest }: IProps) => {
  const Container = link
    ? ({ children }) => <CustomLink to={link}>{children}</CustomLink>
    : Fragment

  return (
    <Container>
      <CustomButton {...rest}>{children}</CustomButton>
    </Container>
  )
}

export default Button
