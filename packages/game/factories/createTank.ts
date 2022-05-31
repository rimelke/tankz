// import {
//   DEFAULT_HEALTH,
//   STEP_MOVE,
//   STEP_ROTATION,
//   TANK_SIZE
// } from '../constants'
// import { IPosition } from './createGame'
// import { TankType } from '../tankTypes'
// import { ILine } from '../utils/getLinesIntersection'
// import getTankPoints from '../utils/getTankPoints'

import { STEP_MOVE, STEP_ROTATION, TANK_SIZE } from '../constants'
import { IPosition } from '../types'

// export type IContinuosAction =
//   | 'MoveForward'
//   | 'MoveBackward'
//   | 'TurnLeft'
//   | 'TurnRight'
// export type ISingleAction = 'Fire'
// export type IAction = IContinuosAction | ISingleAction

// interface ITankState {
//   health: number
//   pos: IPosition
//   direction: number
//   actions: Partial<Record<IContinuosAction, boolean>>
// }

// export interface ITank {
//   id: string
//   type: TankType
//   state: ITankState
//   getTankLines(): ILine[]
//   startAction(action: IContinuosAction): void
//   stopAction(action: IContinuosAction): void
//   singleAction(action: ISingleAction): void
//   killTank(): void
// }

// interface IDefaultPos extends IPosition {
//   direction: number
// }

// interface ICreateTankProps {
//   id: string
//   defaultPos: IDefaultPos
//   addBullet: (pos: IPosition, direction: number) => void
//   checkCollision?: (points: IPosition[]) => boolean
// }

// const createTank = ({
//   id,
//   defaultPos,
//   addBullet,
//   checkCollision
// }: ICreateTankProps): ITank => {
//   const state: ITankState = {
//     actions: {},
//     direction: defaultPos.direction,
//     health: DEFAULT_HEALTH,
//     pos: {
//       x: defaultPos.x,
//       y: defaultPos.y
//     }
//   }

//   const getTankLines = () => {
//     const tankPoints = getTankPoints(state.pos.x, state.pos.y, state.direction)
//     const tmpPoints = [...tankPoints, tankPoints[0]]

//     const tankLines: ILine[] = []

//     for (let i = 0; i < tmpPoints.length - 1; i++) {
//       tankLines.push({
//         point1: {
//           x: tmpPoints[i].x,
//           y: tmpPoints[i].y
//         },
//         point2: {
//           x: tmpPoints[i + 1].x,
//           y: tmpPoints[i + 1].y
//         }
//       })
//     }

//     return tankLines
//   }

//   const moveTank = (step: number) => {
//     const radiansAngle = (Math.PI * state.direction) / 180

//     const rSin = Math.sin(radiansAngle)
//     const rCos = Math.cos(radiansAngle)

//     const newX = state.pos.x + step * rSin
//     const newY = state.pos.y - step * rCos

//     if (
//       checkCollision &&
//       checkCollision(getTankPoints(newX, newY, state.direction))
//     )
//       return

//     state.pos.x = newX
//     state.pos.y = newY
//   }

//   const rotateTank = (step: number) => {
//     const newDirection = state.direction + step

//     if (
//       checkCollision &&
//       checkCollision(getTankPoints(state.pos.x, state.pos.y, newDirection))
//     )
//       return

//     state.direction = newDirection
//   }

//   const getMouth = () => {
//     const x = state.pos.y
//     const y = state.pos.x + TANK_SIZE.width / 2

//     const radiansAngle = (Math.PI * state.direction) / 180

//     const rSin = Math.sin(radiansAngle)
//     const rCos = Math.cos(radiansAngle)

//     const xo = state.pos.y + TANK_SIZE.height / 2
//     const yo = state.pos.x + TANK_SIZE.width / 2

//     const xr = yo - (x - xo) * rSin + (y - yo) * rCos
//     const yr = xo + (x - xo) * rCos + (y - yo) * rSin

//     return { x: xr, y: yr }
//   }

//   const actionsCalls: Record<IAction, () => void> = {
//     MoveForward: () => moveTank(STEP_MOVE),
//     MoveBackward: () => moveTank(-STEP_MOVE),
//     TurnLeft: () => rotateTank(-STEP_ROTATION),
//     TurnRight: () => rotateTank(STEP_ROTATION),
//     Fire: () => addBullet(getMouth(), state.direction)
//   }

//   // const interval = setInterval(() => {

//   // }, 10)

//   const makeActions = () => {
//     Object.entries(state.actions).forEach(([action, isActive]) => {
//       if (isActive) actionsCalls[action as IAction]()
//     })
//   }

//   const startAction = (action: IContinuosAction) => {
//     state.actions[action] = true
//   }

//   const stopAction = (action: IContinuosAction) => {
//     state.actions[action] = false
//   }

//   const singleAction = (action: ISingleAction) => {
//     actionsCalls[action]()
//   }

//   const killTank = () => {
//     clearInterval(interval)
//   }

//   return {
//     id,
//     type: 'tank1',
//     state,
//     getTankLines,
//     startAction,
//     stopAction,
//     singleAction,
//     killTank
//   }
// }

// export default createTank

export type IContinuosAction =
  | 'MoveForward'
  | 'MoveBackward'
  | 'TurnLeft'
  | 'TurnRight'
export type ISingleAction = 'Fire'
export type IAction = IContinuosAction | ISingleAction

interface IState {
  runningActions: Set<IContinuosAction>
  position: IPosition
}

export interface ITank {
  runActions(): void
  startAction(action: IContinuosAction): void
  stopAction(action: IContinuosAction): void
  makeSingleAction(action: ISingleAction): void

  state: IState
  id: string
}

interface ICreateTankProps {
  id: string
  addBullet: (position: IPosition) => void
  defaultPosition: IPosition
}

const createTank = ({
  id,
  addBullet,
  defaultPosition
}: ICreateTankProps): ITank => {
  const state: IState = {
    runningActions: new Set(),
    position: defaultPosition
  }

  const moveTank = (step: number) => {
    const radiansAngle = (Math.PI * state.position.direction) / 180

    const rSin = Math.sin(radiansAngle)
    const rCos = Math.cos(radiansAngle)

    const newX = state.position.x + step * rSin
    const newY = state.position.y - step * rCos

    // if (
    //   checkCollision &&
    //   checkCollision(getTankPoints(newX, newY, state.direction))
    // )
    //   return

    state.position.x = newX
    state.position.y = newY
  }

  const rotateTank = (step: number) => {
    const newDirection = state.position.direction + step

    // if (
    //   checkCollision &&
    //   checkCollision(getTankPoints(state.pos.x, state.pos.y, newDirection))
    // )
    //   return

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

  return {
    id,
    runActions,
    startAction,
    stopAction,
    makeSingleAction,
    state
  }
}

export default createTank
