import { useQuery } from '@apollo/client'
import Error from '../../../components/Error'
import Loading from '../../../components/Loading'
import PageContainer from '../../../components/PageContainer'
import { GET_RUNNING_GAMES } from '../../../constants/queries'
import GameList from '../../../components/GameList'
import IGame from '../../../types/IGame'

interface IGetRunningGamesResponse {
  getRunningGames: IGame[]
}

const PlayFind = () => {
  const { loading, error, data } =
    useQuery<IGetRunningGamesResponse>(GET_RUNNING_GAMES)

  if (loading) return <Loading />
  if (error) return <Error>{error.message}</Error>

  return (
    <PageContainer title="Find a game">
      <GameList games={data.getRunningGames} />
    </PageContainer>
  )
}

export default PlayFind
