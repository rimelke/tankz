import GameProvider from '@providers/GameProvider'
import * as maps from '@tankz/game/maps'
import makeCreateGameValidator from './validation'

interface IMakeCreateGameProps {
  gameProvider: GameProvider
}

export interface ICreateGameDTO {
  map: keyof typeof maps
}

const makeCreateGame = ({ gameProvider }: IMakeCreateGameProps) => {
  const createGame = (data: ICreateGameDTO) => {
    const game = gameProvider.create(data.map)

    return game
  }

  const createGameValidator = makeCreateGameValidator()

  const createGameController = (data: ICreateGameDTO) => {
    const validatedData = createGameValidator.validate(data)

    return createGame(validatedData)
  }

  return createGameController
}

export default makeCreateGame
