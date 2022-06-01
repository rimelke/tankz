import { Game } from '@entities/game'
import { Player } from '@entities/player'
import { IGame } from '@tankz/game'
import { ITank } from '@tankz/game/factories/createTank'
import * as maps from '@tankz/game/maps'

export interface RunningGame extends Game {
  instance: IGame
}

interface GameProvider {
  create(map: keyof typeof maps): RunningGame
  getRunningGames(): RunningGame[]
  addPlayer(gameId: string, player: Player): ITank
  removePlayer(playerId: string): void
  getGame(gameId: string): RunningGame
}

export default GameProvider
