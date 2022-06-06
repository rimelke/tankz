import { useQuery } from '@apollo/client'
import Error from '../../components/Error'
import GameList from '../../components/GameList'
import Loading from '../../components/Loading'
import PageContainer from '../../components/PageContainer'
import { GET_SAVED_GAMES } from '../../constants/queries'
import IGame from '../../types/IGame'

interface IGetSavedGamesResponse {
  getSavedGames: IGame[]
}

const History = () => {
  const { data, loading, error } =
    useQuery<IGetSavedGamesResponse>(GET_SAVED_GAMES)

  if (loading) return <Loading />
  if (error) return <Error>{error.message}</Error>

  return (
    <PageContainer title="History">
      <GameList isReadOnly games={data.getSavedGames} />
    </PageContainer>
  )
}

export default History
