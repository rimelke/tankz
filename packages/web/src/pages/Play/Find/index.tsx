import { useQuery } from '@apollo/client'
import Error from '../../../components/Error'
import Loading from '../../../components/Loading'
import PageContainer from '../../../components/PageContainer'
import { GET_RUNNING_GAMES } from '../../../constants/queries'
import * as maps from '@tankz/game/maps'
import Map from '../../../components/Map'
import {
  GameContainer,
  GameContent,
  GameId,
  GameList,
  JoinButton,
  MapContainer,
  PlayerList
} from './styled'

interface IGame {
  id: string
  map: keyof typeof maps
  players: {
    id: string
    nickname: string
  }[]
}

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
      <GameList>
        {data.getRunningGames.length > 0 ? (
          data.getRunningGames.map((game) => (
            <GameContainer key={game.id}>
              <GameId>{game.id}</GameId>

              <GameContent>
                <MapContainer>
                  <Map singleRender map={maps[game.map]} />
                </MapContainer>
                <PlayerList>
                  {game.players.map((player) => (
                    <li key={player.id}>{player.nickname}</li>
                  ))}
                </PlayerList>
                <JoinButton to={`/play/${game.id}`}>join</JoinButton>
              </GameContent>
            </GameContainer>
          ))
        ) : (
          <p>No games found</p>
        )}
      </GameList>
    </PageContainer>
  )
}

export default PlayFind
