import * as maps from '@tankz/game/maps'

interface IGame {
  id: string
  map: keyof typeof maps
  players: {
    id: string
    nickname: string
  }[]
  winnerId?: string
  duration?: number
}

export default IGame
