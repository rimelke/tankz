import {
  BULLET_POWER,
  DEFAULT_HEALTH,
  MAP_SIZE,
  STEP_BULLET
} from './constants'
import createTank, { ITank } from './createTank'
import map1 from './maps/map1'
import checkLimitsCollision from './utils/checkLimitsCollision'
import checkPointInTank from './utils/checkPointInTank'
import checkPointsCollision from './utils/checkPointsCollision'
import { ILine } from './utils/getLinesIntersection'
import getTankPoints, { getRawTankPoints } from './utils/getTankPoints'

export interface IPosition {
  x: number
  y: number
}

interface IBullet {
  pos: IPosition
  direction: number
}

export interface IMapObject {
  x: number
  y: number
  width: number
  height: number
  health?: number
  lines: ILine[]
}

type IStatus = 'waiting' | 'running' | 'ended'

interface IGame {
  tanks: ITank[]
  bullets: IBullet[]
  map: IMapObject[]
  startedAt?: number
  endedAt?: number
  status: IStatus

  addTank(id: string): ITank
  endGame(): void
}

const createGame = (): IGame => {
  const tanks: ITank[] = []
  const bullets: IBullet[] = []
  const map: IMapObject[] = Array.from(map1).map((obj) => ({
    ...obj,
    lines: [
      {
        point1: { x: obj.x, y: obj.y },
        point2: { x: obj.x + obj.width, y: obj.y }
      },
      {
        point1: { x: obj.x, y: obj.y },
        point2: { x: obj.x, y: obj.y + obj.height }
      },
      {
        point1: { x: obj.x + obj.width, y: obj.y },
        point2: { x: obj.x + obj.width, y: obj.y + obj.height }
      },
      {
        point1: { x: obj.x, y: obj.y + obj.height },
        point2: { x: obj.x + obj.width, y: obj.y + obj.height }
      }
    ]
  }))
  let status: IStatus = 'waiting'

  const moveBullet = (bullet: IBullet, index: number) => {
    const radiansAngle = (Math.PI * bullet.direction) / 180

    const rSin = Math.sin(radiansAngle)
    const rCos = Math.cos(radiansAngle)

    const newX = bullet.pos.x + STEP_BULLET * rSin
    const newY = bullet.pos.y - STEP_BULLET * rCos

    if (
      checkLimitsCollision([{ x: newX, y: newY }]) ||
      map.some(({ x, y, width, height }, mapIndex) => {
        const isCollised =
          newX > x && newX < x + width && newY > y && newY < y + height

        if (isCollised) {
          const mapObject = map[mapIndex]

          mapObject.health = (mapObject.health || DEFAULT_HEALTH) - BULLET_POWER

          if (mapObject.health <= 0) map.splice(mapIndex, 1)
        }

        return isCollised
      }) ||
      tanks.some((tank, tankIndex) => {
        const isCollised = checkPointInTank(
          { x: newX, y: newY },
          getRawTankPoints(
            tank.state.pos.x,
            tank.state.pos.y,
            tank.state.direction
          )
        )

        if (isCollised) {
          tank.state.health -= BULLET_POWER

          if (tank.state.health <= 0) {
            tanks.splice(tankIndex, 1)
            tank.killTank()
          }
        }

        return isCollised
      })
    ) {
      bullets.splice(index, 1)
      return
    }

    bullet.pos.x = newX
    bullet.pos.y = newY
  }

  const interval = setInterval(() => {
    bullets.forEach((bullet, index) => {
      moveBullet(bullet, index)
    })
  }, 10)

  const checkTankCollision = (id: string, points: IPosition[]) =>
    checkLimitsCollision(points) ||
    checkPointsCollision(
      points,
      map.reduce((prevArr, obj) => prevArr.concat(obj.lines), [] as ILine[])
    ) ||
    tanks.some((tank) =>
      tank.id === id ? false : checkPointsCollision(points, tank.getTankLines())
    )

  const addTank = (id: string) => {
    const getRandomPosition = () => {
      const x = Math.random() * MAP_SIZE.width
      const y = Math.random() * MAP_SIZE.height
      const direction = Math.random() * 360

      if (checkTankCollision(id, getTankPoints(x, y, direction)))
        return getRandomPosition()

      return { x, y, direction }
    }

    const tank = createTank({
      id,
      defaultPos: getRandomPosition(),
      addBullet: (pos, direction) => bullets.push({ pos, direction }),
      checkCollision: (points) => checkTankCollision(id, points)
    })

    tanks.push(tank)

    return tank
  }

  const endGame = () => {
    clearInterval(interval)
    status = 'ended'
  }

  return {
    bullets,
    map,
    status,
    tanks,
    endGame,
    // startAction,
    // stopAction,
    // singleAction,
    addTank
  }
}

export default createGame
