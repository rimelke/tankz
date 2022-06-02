import { ButtonHTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'

export const CustomButton = styled.button`
  text-decoration: none;
  color: #ffffff;
  background: black;
  transition: all 0.2s ease-in-out;
  padding: 0.8rem;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`

interface IButtonProps {
  children: ReactNode
}

type IProps = IButtonProps & ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({ children, ...rest }: IProps) => (
  <CustomButton {...rest}>{children}</CustomButton>
)

export default Button
