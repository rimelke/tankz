import {
  DEFAULT_HEALTH,
  STEP_MOVE,
  STEP_ROTATION,
  TANK_SIZE
} from './constants'
import { IPosition } from './createGame'
import { TankType } from './tankTypes'
import { ILine } from './utils/getLinesIntersection'

export type IContinuosAction =
  | 'MoveForward'
  | 'MoveBackward'
  | 'TurnLeft'
  | 'TurnRight'
export type ISingleAction = 'Fire'
export type IAction = IContinuosAction | ISingleAction

interface ITankState {
  health: number
  pos: IPosition
  direction: number
  actions: Partial<Record<IContinuosAction, boolean>>
}

export interface ITank {
  id: string
  type: TankType
  state: ITankState
  getTankLines(): void
  startAction(action: IContinuosAction): void
  stopAction(action: IContinuosAction): void
  singleAction(action: ISingleAction): void
  killTank(): void
}

interface ICreateTankProps {
  id: string
  addBullet: (pos: IPosition, direction: number) => void
  checkCollision: (points: IPosition[]) => boolean
}

const createTank = ({
  id,
  addBullet,
  checkCollision
}: ICreateTankProps): ITank => {
  const state: ITankState = {
    actions: {},
    direction: 0,
    health: DEFAULT_HEALTH,
    pos: {
      x: 30,
      y: 30
    }
  }

  const getTankPoints = (
    tankX: number,
    tankY: number,
    tankDirection: number
  ) => {
    const radiansAngle = (Math.PI * tankDirection) / 180

    const rSin = Math.sin(radiansAngle)
    const rCos = Math.cos(radiansAngle)

    const xo = tankY + TANK_SIZE.height / 2
    const yo = tankX + TANK_SIZE.width / 2

    const bodyPoints: { x: number; y: number }[] = [
      { x: tankY + TANK_SIZE.canHeight, y: tankX },
      { x: tankY + TANK_SIZE.canHeight, y: tankX + TANK_SIZE.width },
      { x: tankY + TANK_SIZE.height, y: tankX + TANK_SIZE.width },
      { x: tankY + TANK_SIZE.height, y: tankX }
    ]
      .map(({ x, y }) => {
        const xr = yo - (x - xo) * rSin + (y - yo) * rCos
        const yr = xo + (x - xo) * rCos + (y - yo) * rSin

        return { x: xr, y: yr }
      })
      .sort((a, b) => a.x + a.y - (b.x + b.y))

    const canPoints: { x: number; y: number }[] = [
      { x: tankY, y: tankX + (TANK_SIZE.width - TANK_SIZE.canWidth) / 2 },
      { x: tankY, y: tankX + (TANK_SIZE.width + TANK_SIZE.canWidth) / 2 },
      {
        x: tankY + TANK_SIZE.canHeight,
        y: tankX + (TANK_SIZE.width + TANK_SIZE.canWidth) / 2
      },
      {
        x: tankY + TANK_SIZE.canHeight,
        y: tankX + (TANK_SIZE.width - TANK_SIZE.canWidth) / 2
      }
    ]
      .map(({ x, y }) => {
        const xr = yo - (x - xo) * rSin + (y - yo) * rCos
        const yr = xo + (x - xo) * rCos + (y - yo) * rSin

        return { x: xr, y: yr }
      })
      .sort((a, b) => a.x + a.y - (b.x + b.y))

    return [...bodyPoints, ...canPoints]
  }

  const getTankLines = () => {
    const tankPoints = getTankPoints(state.pos.x, state.pos.y, state.direction)
    const tmpPoints = [...tankPoints, tankPoints[0]]

    const tankLines: ILine[] = []

    for (let i = 0; i < tmpPoints.length - 1; i++) {
      tankLines.push({
        point1: {
          x: tmpPoints[i].x,
          y: tmpPoints[i].y
        },
        point2: {
          x: tmpPoints[i + 1].x,
          y: tmpPoints[i + 1].y
        }
      })
    }

    return tankLines
  }

  const moveTank = (step: number) => {
    const radiansAngle = (Math.PI * state.direction) / 180

    const rSin = Math.sin(radiansAngle)
    const rCos = Math.cos(radiansAngle)

    const newX = state.pos.x + step * rSin
    const newY = state.pos.y - step * rCos

    if (checkCollision(getTankPoints(newX, newY, state.direction))) return

    state.pos.x = newX
    state.pos.y = newY
  }

  const rotateTank = (step: number) => {
    const newDirection = state.direction + step

    if (checkCollision(getTankPoints(state.pos.x, state.pos.y, newDirection)))
      return

    state.direction = newDirection
  }

  const getMouth = () => {
    const x = state.pos.y
    const y = state.pos.x + TANK_SIZE.width / 2

    const radiansAngle = (Math.PI * state.direction) / 180

    const rSin = Math.sin(radiansAngle)
    const rCos = Math.cos(radiansAngle)

    const xo = state.pos.y + TANK_SIZE.height / 2
    const yo = state.pos.x + TANK_SIZE.width / 2

    const xr = yo - (x - xo) * rSin + (y - yo) * rCos
    const yr = xo + (x - xo) * rCos + (y - yo) * rSin

    return { x: xr, y: yr }
  }

  const actionsCalls: Record<IAction, () => void> = {
    MoveForward: () => moveTank(STEP_MOVE),
    MoveBackward: () => moveTank(-STEP_MOVE),
    TurnLeft: () => rotateTank(-STEP_ROTATION),
    TurnRight: () => rotateTank(STEP_ROTATION),
    Fire: () => addBullet(getMouth(), state.direction)
  }

  const interval = setInterval(() => {
    Object.entries(state.actions).forEach(([action, isActive]) => {
      if (isActive) actionsCalls[action as IAction]()
    })
  }, 10)

  const startAction = (action: IContinuosAction) => {
    state.actions[action] = true
  }

  const stopAction = (action: IContinuosAction) => {
    state.actions[action] = false
  }

  const singleAction = (action: ISingleAction) => {
    actionsCalls[action]()
  }

  const killTank = () => {
    clearInterval(interval)
  }

  return {
    id,
    type: 'tank1',
    state,
    getTankLines,
    startAction,
    stopAction,
    singleAction,
    killTank
  }
}

export default createTank
