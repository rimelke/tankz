import {
  BULLET_POWER,
  DEFAULT_HEALTH,
  STEP_BULLET,
  STEP_MOVE,
  STEP_ROTATION,
  TANK_SIZE
} from './constants'
import map1 from './maps/map1'
import { TankType } from './tankTypes'

interface IPosition {
  x: number
  y: number
}

type IContinuosAction =
  | 'MoveForward'
  | 'MoveBackward'
  | 'TurnLeft'
  | 'TurnRight'
type ISingleAction = 'Fire'

interface ITank {
  id: string
  type: TankType
  health: number
  pos: IPosition
  direction: number
  actions: Partial<Record<IContinuosAction, boolean>>
}

interface IBullet {
  pos: IPosition
  direction: number
}

interface IMapObject {
  x: number
  y: number
  width: number
  height: number
  health?: number
}

type IStatus = 'waiting' | 'running' | 'ended'

interface IGame {
  tanks: ITank[]
  bullets: IBullet[]
  map: IMapObject[]
  startedAt?: number
  endedAt?: number
  status: IStatus

  endGame(): void
}

const createGame = (): IGame => {
  const tanks: ITank[] = []
  const bullets: IBullet[] = []
  const map: IMapObject[] = Array.from(map1)
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

  const checkTankCollision = (
    tankX: number,
    tankY: number,
    direction: number
  ) => {
    const getTankBoundaries = () => {
      const radiansAngle = (Math.PI * direction) / 180

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

      return { bodyPoints, canPoints }
    }

    const intersect = (
      line1: { x1: number; y1: number; x2: number; y2: number },
      line2: { x1: number; y1: number; x2: number; y2: number }
    ) => {
      if (
        (line1.x1 === line1.x2 && line1.y1 === line1.y2) ||
        (line2.x1 === line2.x2 && line2.y1 === line2.y2)
      )
        return false

      const denominator =
        (line2.y2 - line2.y1) * (line1.x2 - line1.x1) -
        (line2.x2 - line2.x1) * (line1.y2 - line1.y1)

      if (denominator === 0) return false

      const ua =
        ((line2.x2 - line2.x1) * (line1.y1 - line2.y1) -
          (line2.y2 - line2.y1) * (line1.x1 - line2.x1)) /
        denominator
      const ub =
        ((line1.x2 - line1.x1) * (line1.y1 - line2.y1) -
          (line1.y2 - line1.y1) * (line1.x1 - line2.x1)) /
        denominator

      if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return false

      const x = line1.x1 + ua * (line1.x2 - line1.x1)
      const y = line1.y1 + ua * (line1.y2 - line1.y1)

      return { x, y }
    }

    const points = getTankBoundaries()

    return (
      points.bodyPoints.some(
        ({ x, y }) => x < 0 || x > 800 || y < 0 || y > 500
      ) ||
      points.canPoints
        .slice(0, 2)
        .some(({ x, y }) => x < 0 || x > 800 || y < 0 || y > 500) ||
      map.some(({ x, y, width, height }) => {
        const lines = [
          { x1: x, y1: y, x2: x + width, y2: y },
          { x1: x, y1: y, x2: x, y2: y + height },
          { x1: x + width, y1: y, x2: x + width, y2: y + height },
          { x1: x, y1: y + height, x2: x + width, y2: y + height }
        ]

        const aPoints = [
          ...points.bodyPoints,
          ...points.canPoints,
          points.bodyPoints[0]
        ]

        const tankLines = []

        for (let i = 0; i < aPoints.length - 1; i++) {
          const line = {
            x1: aPoints[i].x,
            y1: aPoints[i].y,
            x2: aPoints[i + 1].x,
            y2: aPoints[i + 1].y
          }

          tankLines.push(line)
        }

        return tankLines.some((line) => lines.some((l) => intersect(line, l)))
      })
    )
  }

  const moveTank = (tank: ITank, step: number) => {
    const radiansAngle = (Math.PI * tank.direction) / 180

    const rSin = Math.sin(radiansAngle)
    const rCos = Math.cos(radiansAngle)

    const newX = tank.pos.x + step * rSin
    const newY = tank.pos.y - step * rCos

    if (checkTankCollision(newX, newY, tank.direction)) return

    tank.pos.x = newX
    tank.pos.y = newY
  }

  const rotateTank = (tank: ITank, step: number) => {
    const newDirection = tank.direction + step

    if (checkTankCollision(tank.pos.x, tank.pos.y, newDirection)) return

    tank.direction = newDirection
  }

  const addBullet = (tank: ITank) => {
    const getMouth = () => {
      const x = tank.pos.y
      const y = tank.pos.x + TANK_SIZE.width / 2

      const radiansAngle = (Math.PI * tank.direction) / 180

      const rSin = Math.sin(radiansAngle)
      const rCos = Math.cos(radiansAngle)

      const xo = tank.pos.y + TANK_SIZE.height / 2
      const yo = tank.pos.x + TANK_SIZE.width / 2

      const xr = yo - (x - xo) * rSin + (y - yo) * rCos
      const yr = xo + (x - xo) * rCos + (y - yo) * rSin

      return { x: xr, y: yr }
    }

    const mouth = getMouth()

    bullets.push({
      pos: {
        x: mouth.x,
        y: mouth.y
      },
      direction: tank.direction
    })
  }

  const actionsCalls: Record<
    IContinuosAction | ISingleAction,
    (tank: ITank) => void
  > = {
    MoveForward: (tank) => moveTank(tank, STEP_MOVE),
    MoveBackward: (tank) => moveTank(tank, -STEP_MOVE),
    TurnLeft: (tank) => rotateTank(tank, -STEP_ROTATION),
    TurnRight: (tank) => rotateTank(tank, STEP_ROTATION),
    Fire: addBullet
  }

  const interval = setInterval(() => {
    tanks.forEach((tank) => {
      Object.entries(tank.actions).forEach(([action, isActive]) => {
        if (isActive) actionsCalls[action](tank)
      })
    })

    bullets.forEach((bullet, index) => {
      moveBullet(bullet, index)
    })
  }, 10)

  const endGame = () => {
    clearInterval(interval)
    status = 'ended'
  }

  return {
    bullets,
    map,
    status,
    tanks: [],
    endGame
  }
}

export default createGame
