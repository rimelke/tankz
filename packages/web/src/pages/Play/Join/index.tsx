import { FormHandles } from '@unform/core'
import { useRef } from 'react'
import Button from '../../../components/Button'
import { Input } from '../../../components/Form'
import PageContainer from '../../../components/PageContainer'
import { CustomForm } from './styled'
import * as yup from 'yup'
import validateForm from '../../../utils/validateForm'
import { useNavigate } from 'react-router-dom'

const PlayJoin = () => {
  const formRef = useRef<FormHandles>(null)
  const navigate = useNavigate()

  const handleSubmit = async (data: { gameId: string }) => {
    const validatedData = await validateForm(
      data,
      yup.object().shape({
        gameId: yup.string().required('game id is required')
      }),
      formRef.current
    )

    if (!validatedData) return

    navigate(`/play/${data.gameId}`)
  }

  return (
    <PageContainer title="Join a game">
      <CustomForm ref={formRef} onSubmit={handleSubmit}>
        <Input name="gameId" label="game id" />
        <Button type="submit">join</Button>
      </CustomForm>
    </PageContainer>
  )
}

export default PlayJoin
