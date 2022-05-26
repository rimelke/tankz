import { BULLET_POWER, DEFAULT_HEALTH, STEP_BULLET } from './constants'
import createTank, { ITank } from './createTank'
import map1 from './maps/map1'
import checkPointsCollision from './utils/checkPointsCollision'
import { ILine } from './utils/getLinesIntersection'
import getTankPoints from './utils/getTankPoints'

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
      newX < 0 ||
      newX > 800 ||
      newY < 0 ||
      newY > 500 ||
      map.some(({ x, y, width, height }, mapIndex) => {
        const isCollised =
          newX > x && newX < x + width && newY > y && newY < y + height

        if (isCollised) {
          const mapObject = map[mapIndex]

          mapObject.health = (mapObject.health || DEFAULT_HEALTH) - BULLET_POWER

          if (mapObject.health <= 0) map.splice(mapIndex, 1)
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

  const checkCollision = (points: IPosition[]) =>
    checkPointsCollision(
      points,
      map.reduce((prevArr, obj) => prevArr.concat(obj.lines), [] as ILine[])
    )

  const addTank = (id: string) => {
    const getRandomPosition = () => {
      const x = Math.random() * 800
      const y = Math.random() * 500
      const direction = Math.random() * 360

      if (checkCollision(getTankPoints(x, y, direction)))
        return getRandomPosition()

      return { x, y, direction }
    }

    const tank = createTank({
      id,
      defaultPos: getRandomPosition(),
      addBullet: (pos, direction) => bullets.push({ pos, direction }),
      checkCollision
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
