import {
  DEFAULT_HEALTH,
  STEP_MOVE,
  STEP_ROTATION,
  TANK_SIZE
} from '../constants'
import { IPosition, ISimplePosition } from '../types'
import getTankPoints from '../utils/getTankPoints'

export type IContinuosAction =
  | 'MoveForward'
  | 'MoveBackward'
  | 'TurnLeft'
  | 'TurnRight'
export type ISingleAction = 'Fire'
export type IAction = IContinuosAction | ISingleAction

export interface IRawTankState {
  id: string
  health: number
  state: {
    runningActions: IContinuosAction[]
    position: IPosition
  }
}

interface IState {
  health: number
  runningActions: Set<IContinuosAction>
  position: IPosition
}

export interface ITank {
  runActions(): void
  startAction(action: IContinuosAction): void
  stopAction(action: IContinuosAction): void
  makeSingleAction(action: ISingleAction): void
  getState(): IRawTankState

  state: IState
  id: string
}

interface ICreateTankProps {
  id: string
  addBullet: (position: IPosition) => void
  defaultPosition: IPosition
  defaultActions?: IContinuosAction[]
  checkCollision: (id: string, points: ISimplePosition[]) => boolean
}

const createTank = ({
  id,
  addBullet,
  defaultPosition,
  defaultActions = [],
  checkCollision
}: ICreateTankProps): ITank => {
  const state: IState = {
    health: DEFAULT_HEALTH,
    runningActions: new Set(defaultActions),
    position: defaultPosition
  }

  const moveTank = (step: number) => {
    const radiansAngle = (Math.PI * state.position.direction) / 180

    const rSin = Math.sin(radiansAngle)
    const rCos = Math.cos(radiansAngle)

    const newX = state.position.x + step * rSin
    const newY = state.position.y - step * rCos

    if (checkCollision(id, getTankPoints(newX, newY, state.position.direction)))
      return

    state.position.x = newX
    state.position.y = newY
  }

  const rotateTank = (step: number) => {
    const newDirection = state.position.direction + step

    if (
      checkCollision(
        id,
        getTankPoints(state.position.x, state.position.y, newDirection)
      )
    )
      return

    state.position.direction = newDirection
  }

  const getMouth = () => {
    const x = state.position.y
    const y = state.position.x + TANK_SIZE.width / 2

    const radiansAngle = (Math.PI * state.position.direction) / 180

    const rSin = Math.sin(radiansAngle)
    const rCos = Math.cos(radiansAngle)

    const xo = state.position.y + TANK_SIZE.height / 2
    const yo = state.position.x + TANK_SIZE.width / 2

    const xr = yo - (x - xo) * rSin + (y - yo) * rCos
    const yr = xo + (x - xo) * rCos + (y - yo) * rSin

    return { x: xr, y: yr }
  }

  const fireBullet = () => {
    const mouth = getMouth()

    addBullet({
      x: mouth.x,
      y: mouth.y,
      direction: state.position.direction
    })
  }

  const possibleActions: Record<IAction, () => void> = {
    MoveForward: () => moveTank(STEP_MOVE),
    MoveBackward: () => moveTank(-STEP_MOVE),
    TurnLeft: () => rotateTank(-STEP_ROTATION),
    TurnRight: () => rotateTank(STEP_ROTATION),
    Fire: fireBullet
  }

  const startAction = (action: IContinuosAction) => {
    state.runningActions.add(action)
  }

  const stopAction = (action: IContinuosAction) => {
    state.runningActions.delete(action)
  }

  const makeSingleAction = (action: ISingleAction) => {
    possibleActions[action]()
  }

  const runActions = () => {
    state.runningActions.forEach((action) => possibleActions[action]())
  }

  const getState = (): IRawTankState => ({
    id,
    health: state.health,
    state: {
      runningActions: [...state.runningActions],
      position: state.position
    }
  })

  return {
    id,
    runActions,
    startAction,
    stopAction,
    makeSingleAction,
    state,
    getState
  }
}

export default createTank
