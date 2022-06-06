import AppError from '@errors/AppError'
import GameProvider, { RunningGame } from '@providers/GameProvider'
import GameRepository from '@repositories/GameRepository'
import createGame from '@tankz/game'
import * as maps from '@tankz/game/maps'
import { nanoid } from 'nanoid'

interface IMakeMemoryGameProviderProps {
  gameRepository: GameRepository
}

const makeMemoryGameProvider = ({
  gameRepository
}: IMakeMemoryGameProviderProps): GameProvider => {
  const games: RunningGame[] = []
  const playerIds: Record<string, string> = {}

  const destroyGame = (game: RunningGame) => {
    games.splice(
      games.findIndex((g) => g.id === game.id),
      1
    )
  }

  const memoryGameProvider: GameProvider = {
    create: (map) => {
      const game: RunningGame = {
        id: nanoid(),
        map,
        players: [],
        instance: createGame({ map: maps[map] })
      }

      games.push(game)

      game.instance.subscribe((event) => {
        if (event.type !== 'gameEnded') return

        const winnerId = event.payload.winnerId

        if (winnerId) {
          gameRepository.save({
            map,
            players: game.players,
            winnerId,
            duration: event.payload.duration
          })
        }

        destroyGame(game)
      })

      return game
    },
    getRunningGames: () =>
      games.filter(
        (game) =>
          ['waiting', 'preparing'].includes(game.instance.state.status) &&
          game.players.length < 4
      ),
    addPlayer: (gameId, player) => {
      const game = games.find((game) => game.id === gameId)

      if (!game) throw new AppError('game not found')

      if (playerIds[player.id]) throw new AppError('player already in game')

      if (game.players.length >= 4) throw new AppError('game is full')

      if (
        !['init', 'waiting', 'preparing'].includes(game.instance.state.status)
      )
        throw new AppError('game is not waiting or preparing')

      game.instance.addTank(player.id)
      game.players.push(player)
      playerIds[player.id] = gameId

      return game
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
      playerIds[playerId] = undefined

      if (game.players.length === 0) destroyGame(game)

      return game
    }
  }

  return memoryGameProvider
}

export default makeMemoryGameProvider
