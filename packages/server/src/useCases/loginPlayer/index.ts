import AppError from '@errors/AppError'
import HashProvider from '@providers/HashProvider'
import TokenProvider from '@providers/TokenProvider'
import PlayerRepository from '@repositories/PlayerRepository'

export interface ILoginPlayerDTO {
  nickname: string
  password: string
}

interface IMakeLoginPlayerProps {
  playerRepository: PlayerRepository
  hashProvider: HashProvider
  tokenProvider: TokenProvider
}

const makeLoginPlayer = ({
  hashProvider,
  playerRepository,
  tokenProvider
}: IMakeLoginPlayerProps) => {
  const loginPlayer = async (data: ILoginPlayerDTO) => {
    const player = await playerRepository.findByNickname(data.nickname)

    if (!player) throw new AppError('player not found')

    const passwordIsValid = await hashProvider.compare(
      data.password,
      player.password
    )

    if (!passwordIsValid) throw new AppError('password is invalid')

    const token = await tokenProvider.generate(player.id)

    return {
      token
    }
  }

  return loginPlayer
}

export default makeLoginPlayer
