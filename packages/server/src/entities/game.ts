import * as maps from '@tankz/game/maps'
import { Player } from './player'

export interface Game {
  id: string
  map: keyof typeof maps
  players: Player[]
}
