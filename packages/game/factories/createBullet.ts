import { STEP_BULLET } from '../constants'
import { IPosition } from '../types'

interface IProps {
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
  moveBullet: () => void
}

const createBullet = ({ defaultPos }: IProps): IBullet => {
  const state: IState = {
    position: {
      x: defaultPos.x,
      y: defaultPos.y,
      direction: defaultPos.direction
    }
  }

  const moveBullet = () => {
    const radiansAngle = (Math.PI * state.position.direction) / 180

    const rSin = Math.sin(radiansAngle)
    const rCos = Math.cos(radiansAngle)

    const newX = state.position.x + STEP_BULLET * rSin
    const newY = state.position.y - STEP_BULLET * rCos

    // if (
    //   checkLimitsCollision([{ x: newX, y: newY }]) ||
    //   map.some(({ x, y, width, height }, mapIndex) => {
    //     const isCollised =
    //       newX > x && newX < x + width && newY > y && newY < y + height

    //     if (isCollised) {
    //       const mapObject = map[mapIndex]

    //       mapObject.health = (mapObject.health || DEFAULT_HEALTH) - BULLET_POWER

    //       if (mapObject.health <= 0) map.splice(mapIndex, 1)
    //     }

    //     return isCollised
    //   }) ||
    //   tanks.some((tank, tankIndex) => {
    //     const isCollised = checkPointInTank(
    //       { x: newX, y: newY },
    //       getRawTankPoints(
    //         tank.state.pos.x,
    //         tank.state.pos.y,
    //         tank.state.direction
    //       )
    //     )

    //     if (isCollised) {
    //       tank.state.health -= BULLET_POWER

    //       if (tank.state.health <= 0) {
    //         tanks.splice(tankIndex, 1)
    //         tank.killTank()
    //       }
    //     }

    //     return isCollised
    //   })
    // ) {
    //   bullets.splice(index, 1)
    //   return
    // }

    state.position.x = newX
    state.position.y = newY
  }

  return { moveBullet, state }
}

export default createBullet
