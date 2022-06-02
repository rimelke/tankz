import {
  DEFAULT_HEALTH,
  STEP_MOVE,
  STEP_ROTATION,
  TANK_SIZE
} from '../constants'
import { IEvent, IObserver, IPosition, ISimplePosition } from '../types'
import getTankPoints from '../utils/getTankPoints'

export type IContinuosAction =
  | 'MoveForward'
  | 'MoveBackward'
  | 'TurnLeft'
  | 'TurnRight'
export type ISingleAction = 'Fire'
export type IAction = IContinuosAction | ISingleAction

export interface ITankState {
  health: number
  position: IPosition
}

export interface ITank {
  setPosition(position: IPosition): void
  makeAction(action: IAction): void

  subscribe(observer: IObserver): void
  unsubscribe(observer: IObserver): void

  state: ITankState
  id: string
}

interface ICreateTankProps {
  id: string
  defaultPosition: IPosition
  addBullet: (position: IPosition) => void
  checkCollision: (id: string, points: ISimplePosition[]) => boolean
}

const createTank = ({
  id,
  addBullet,
  defaultPosition,
  checkCollision
}: ICreateTankProps): ITank => {
  const state: ITankState = {
    health: DEFAULT_HEALTH,
    position: defaultPosition
  }

  const observers: IObserver[] = []

  const subscribe = (observer: IObserver) => {
    observers.push(observer)
  }

  const unsubscribe = (observer: IObserver) => {
    observers.splice(observers.indexOf(observer), 1)
  }

  const notifyAll = (event: IEvent) => {
    observers.forEach((observer) => observer(event))
  }

  const setPosition = (position: IPosition) => {
    state.position = position
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

    notifyAll({
      type: 'tankMoved',
      payload: {
        ...state.position
      }
    })
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

    notifyAll({
      type: 'tankRotated',
      payload: { ...state.position }
    })
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

  const makeAction = (action: IAction) => {
    if (possibleActions[action]) possibleActions[action]()
  }

  return {
    id,
    state,
    subscribe,
    unsubscribe,
    setPosition,
    makeAction
  }
}

export default createTank
