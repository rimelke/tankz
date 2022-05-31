import { Game } from '@entities/game'
import GameProvider from '@providers/GameProvider'
import createGame, { IGame } from '@tankz/game'
import * as maps from '@tankz/game/maps'
import { nanoid } from 'nanoid'

interface RunningGame extends Game {
  instance: IGame
}

const makeMemoryGameProvider = (): GameProvider => {
  const games: RunningGame[] = []

  const setDestroyTimeout = (id: string) => {
    setTimeout(() => {
      const index = games.findIndex((game) => game.id === id)

      if (index === -1) return

      games[index].instance.endGame()

      games.splice(index, 1)
    }, 10 * 1000)
  }

  const memoryGameProvider: GameProvider = {
    create: (map) => {
      const game: Game = {
        id: nanoid(),
        map,
        players: []
      }

      games.push({ ...game, instance: createGame({ map: maps[map] }) })

      setDestroyTimeout(game.id)

      return game
    },
    getRunningGames: () => games.map(({ instance, ...game }) => game)
  }

  return memoryGameProvider
}

export default makeMemoryGameProvider
