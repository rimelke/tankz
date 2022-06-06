import IGame from '../../types/IGame'
import Map from '../Map'
import {
  GameContainer,
  GameContent,
  GameId,
  GameListContainer,
  JoinButton,
  MapContainer,
  PlayerList,
  PlayerNickname
} from './styled'
import * as maps from '@tankz/game/maps'
import { useAuth } from '../../contexts/AuthContext'

interface IGameListProps {
  games: IGame[]
  isReadOnly?: boolean
}

const GameList = ({ games, isReadOnly }: IGameListProps) => {
  const { nickname } = useAuth()

  return (
    <GameListContainer>
      {games.length > 0 ? (
        games.map((game) => (
          <GameContainer key={game.id}>
            <GameId>{game.id}</GameId>

            <GameContent>
              <MapContainer>
                <Map singleRender map={maps[game.map]} />
              </MapContainer>
              <PlayerList>
                {game.players
                  .slice()
                  .sort((a, b) => {
                    if (a.id === game.winnerId) return 1
                    if (b.id === game.winnerId) return -1

                    return 0
                  })
                  .map((player) => (
                    <PlayerNickname
                      isCurrentPlayer={player.nickname === nickname}
                      key={player.id}>
                      {player.nickname}
                    </PlayerNickname>
                  ))}
              </PlayerList>
              {!isReadOnly && (
                <JoinButton to={`/play/${game.id}`}>join</JoinButton>
              )}
            </GameContent>
          </GameContainer>
        ))
      ) : (
        <p>No games found</p>
      )}
    </GameListContainer>
  )
}

export default GameList
