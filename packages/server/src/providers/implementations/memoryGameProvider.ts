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
  const playerIds: Record<string, string> = {}

  const destroyGame = (game: RunningGame) => {
    game.instance.endGame()
    games.splice(games.indexOf(game), 1)
  }

  const setDestroyTimeout = (id: string) => {
    setTimeout(() => {
      const game = games.find((game) => game.id === id)

      if (!game || game.players.length > 0) return

      destroyGame(game)
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

      console.log('playerIds', playerIds)

      if (playerIds[player.id]) throw new AppError('player already in game')

      const tank = game.instance.addTank(player.id)
      game.players.push(player)
      playerIds[player.id] = gameId

      return tank
    },
    removePlayer: (playerId) => {
      if (!playerIds[playerId]) return

      const game = games.find((game) => game.id === playerIds[playerId])

      if (!game) throw new AppError('game not found')

      game.instance.removeTank(playerId)
      game.players.splice(
        game.players.findIndex((player) => player.id === playerId),
        1
      )

      if (game.players.length === 0) destroyGame(game)
    }
  }

  return memoryGameProvider
}

export default makeMemoryGameProvider
