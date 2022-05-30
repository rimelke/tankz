import PlayerRepository from '@repositories/PlayerRepository'
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
    const nicknameIsUsed = await playerRepository.findByNickname(data.nickname)

    if (nicknameIsUsed) throw new Error('nickname already in use')

    const player = await playerRepository.create({
      nickname: data.nickname,
      password: await hashProvider.hash(data.password)
    })

    return player
  }

  return createPlayer
}

export default makeCreatePlayer
