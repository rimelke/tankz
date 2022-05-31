import { Game } from '@entities/game'
import { Player } from '@entities/player'
import { ITank } from '@tankz/game/factories/createTank'
import * as maps from '@tankz/game/maps'

interface GameProvider {
  create(map: keyof typeof maps): Game
  getRunningGames(): Game[]
  addPlayer(gameId: string, player: Player): ITank
  removePlayer(playerId: string): void
}

export default GameProvider
