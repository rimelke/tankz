import { Game } from '@entities/game'
import AppError from '@errors/AppError'
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

      if (index === -1 || games[index].players.length > 0) return

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
    getRunningGames: () => games.map(({ instance, ...game }) => game),
    addPlayer: (gameId, player) => {
      const game = games.find((game) => game.id === gameId)

      if (!game) throw new AppError('game not found')

      if (game.players.find((gamePlayer) => gamePlayer.id === player.id))
        throw new AppError('player already in game')

      const tank = game.instance.addTank(player.id)
      game.players.push(player)

      return tank
    }
  }

  return memoryGameProvider
}

export default makeMemoryGameProvider
