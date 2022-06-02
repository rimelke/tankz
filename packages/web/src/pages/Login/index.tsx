import { FormHandles } from '@unform/core'
import { useRef } from 'react'
import Button from '../../components/Button'
import { Input } from '../../components/Form'
import {
  Container,
  Content,
  ContentTitle,
  Divisor,
  ErrorMessage,
  SuccessMessage
} from './styled'
import validateForm from '../../utils/validateForm'
import * as yup from 'yup'
import { useMutation } from '@apollo/client'
import { CREATE_PLAYER, LOGIN_PLAYER } from '../../constants/queries'
import Loading from '../../components/Loading'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const { setToken } = useAuth()

  const signupFormRef = useRef<FormHandles>(null)
  const [createPlayer, { loading, error, data, reset }] =
    useMutation(CREATE_PLAYER)

  const loginFormRef = useRef<FormHandles>(null)
  const [
    loginPlayer,
    { loading: loadingLogin, error: errorLogin, reset: resetLogin }
  ] = useMutation(LOGIN_PLAYER)

  const handleSignup = async (data: {
    nickname: string
    password: string
    repeatPassword: string
  }) => {
    reset()

    const validatedData = await validateForm(
      data,
      yup.object().shape({
        nickname: yup
          .string()
          .trim()
          .matches(/^\S+$/, 'nickname must not contain spaces')
          .required('nickname is required'),
        password: yup
          .string()
          .min(8, 'password must be at least 8 characters')
          .required('password is required'),
        repeatPassword: yup
          .string()
          .oneOf([yup.ref('password')], 'passwords must be the same')
          .required('repeat password is required')
      }),
      signupFormRef.current
    )

    if (!validatedData) return

    createPlayer({
      variables: {
        nickname: validatedData.nickname,
        password: validatedData.password
      }
    })

    // console.log('errors', errors)
  }

  const handleLogin = async (data: { nickname: string; password: string }) => {
    resetLogin()

    const validatedData = await validateForm(
      data,
      yup.object().shape({
        nickname: yup.string().trim().required('nickname is required'),
        password: yup.string().required('password is required')
      }),
      loginFormRef.current
    )

    if (!validatedData) return

    loginPlayer({
      variables: {
        nickname: validatedData.nickname,
        password: validatedData.password
      }
    }).then(({ data }) => {
      if (data) setToken(data.loginPlayer.token)
    })
  }

  return (
    <Container>
      <Content ref={signupFormRef} onSubmit={handleSignup}>
        <ContentTitle>Signup</ContentTitle>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Input name="nickname" label="nickname" autoComplete="off" />
            <Input
              name="password"
              type="password"
              label="password"
              autoComplete="off"
            />
            <Input
              type="password"
              name="repeatPassword"
              label="repeat password"
              autoComplete="off"
            />
            <Button type="submit">signup</Button>
            {data && <SuccessMessage>status: ok</SuccessMessage>}
            {error && <ErrorMessage>err: {error.message}</ErrorMessage>}
          </>
        )}
      </Content>
      <Divisor />
      <Content ref={loginFormRef} onSubmit={handleLogin}>
        <ContentTitle>Login</ContentTitle>
        {loadingLogin ? (
          <Loading />
        ) : (
          <>
            {' '}
            <Input name="nickname" label="nickname" autoComplete="off" />
            <Input
              name="password"
              type="password"
              label="password"
              autoComplete="off"
            />
            <Button>login</Button>
            {errorLogin && (
              <ErrorMessage>err: {errorLogin.message}</ErrorMessage>
            )}
          </>
        )}
      </Content>
    </Container>
  )
}

export default Login
