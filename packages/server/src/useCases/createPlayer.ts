import PlayerRepository from '@repositories/PlayerRepository'
import makeValidator from '@validation/index'
import isRequired from '@validation/validators/isRequired'
import HashProvider from '@providers/HashProvider'

interface IMakeCreatePlayerProps {
  playerRepository: PlayerRepository
  hashProvider: HashProvider
}

export interface ICreatePlayerDTO {
  nickname: string
  password: string
}

const makeCreatePlayer = ({
  playerRepository,
  hashProvider
}: IMakeCreatePlayerProps) => {
  const createPlayer = async (data: ICreatePlayerDTO) => {
    const validator = makeValidator<ICreatePlayerDTO>({
      nickname: [isRequired()],
      password: [isRequired()]
    })

    const validatedData = validator.validate(data)

    const player = await playerRepository.create({
      nickname: validatedData.nickname,
      password: await hashProvider.hash(validatedData.password)
    })

    return player
  }

  return createPlayer
}

export default makeCreatePlayer
