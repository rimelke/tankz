import PlayerRepository from '@repositories/PlayerRepository'
import HashProvider from '@providers/HashProvider'
import AppError from '@errors/AppError'
import makeCreatePlayerValidator from './validation'

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
    const nicknameIsUsed = await playerRepository.findByNickname(data.nickname)

    if (nicknameIsUsed) throw new AppError('nickname already in use')

    const player = await playerRepository.create({
      nickname: data.nickname,
      password: await hashProvider.hash(data.password)
    })

    return player
  }

  const createPlayerController = async (data: ICreatePlayerDTO) => {
    const createPlayerValidator = makeCreatePlayerValidator()

    const validatedData = createPlayerValidator.validate(data)

    return createPlayer(validatedData)
  }

  return createPlayerController
}

export default makeCreatePlayer
