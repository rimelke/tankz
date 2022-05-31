import { Game } from '@entities/game'
import * as maps from '@tankz/game/maps'

interface GameProvider {
  create(map: keyof typeof maps): Game
}

export default GameProvider
