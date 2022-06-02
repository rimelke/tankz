import { STEP_BULLET } from '../constants'
import { IPosition, ISimplePosition } from '../types'

interface IProps {
  checkCollision: (position: ISimplePosition) => boolean
  defaultPos: {
    x: number
    y: number
    direction: number
  }
}

interface IState {
  position: IPosition
}

export interface IBullet {
  state: IState
  moveBullet: () => boolean
}

const createBullet = ({ defaultPos, checkCollision }: IProps): IBullet => {
  const state: IState = {
    position: {
      x: defaultPos.x,
      y: defaultPos.y,
      direction: defaultPos.direction
    }
  }

  const moveBullet = (): boolean => {
    const radiansAngle = (Math.PI * state.position.direction) / 180

    const rSin = Math.sin(radiansAngle)
    const rCos = Math.cos(radiansAngle)

    const newX = state.position.x + STEP_BULLET * rSin
    const newY = state.position.y - STEP_BULLET * rCos

    if (checkCollision({ x: newX, y: newY })) return false

    state.position.x = newX
    state.position.y = newY

    return true
  }

  return { moveBullet, state }
}

export default createBullet
