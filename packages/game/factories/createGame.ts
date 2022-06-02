import { BULLET_POWER, DEFAULT_HEALTH } from '../constants'
import { IMap, IPosition, ISimplePosition, IMapObject } from '../types'
import checkPointInRectangle from '../utils/checkPointInRectangle'
import checkPointsCollision from '../utils/checkPointsCollision'
import getLinesFromPoints from '../utils/getLinesFromPoints'
import { ILine } from '../utils/getLinesIntersection'
import getTankPoints, { getRawTankPoints } from '../utils/getTankPoints'
import createBullet, { IBullet } from './createBullet'
import createTank, { ITank, IRawTankState } from './createTank'
import makeCheckLimitsCollision from './makeCheckLimitsCollision'

interface IGameObject extends IMapObject {
  state: {
    health: number
  }
  lines: ILine[]
}

export interface IGameState {
  tanks: ITank[]
  bullets: IBullet[]
  objects: IGameObject[]
}

interface IRawState {
  tanks: IRawTankState[]
  objects: IGameObject[]
}

export interface IGame {
  state: IGameState

  addTank: (id: string) => ITank
  removeTank: (id: string) => void
  getState: () => IRawState
  setState: (state: IRawState) => void
  endGame: () => void
}

interface ICreateGameProps {
  map: IMap
}

const createGame = ({ map }: ICreateGameProps): IGame => {
  const state: IGameState = {
    tanks: [],
    bullets: [],
    objects: map.objects.map((obj) => ({
      ...obj,
      state: {
        health: DEFAULT_HEALTH
      },
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
  }

  const interval = setInterval(() => {
    state.tanks.forEach((tank) => tank.runActions())
    state.bullets.forEach(
      (bullet, index) => !bullet.moveBullet() && state.bullets.splice(index, 1)
    )
  }, 10)

  const decreaseHealth = (type: 'tanks' | 'objects', index: number) => {
    const entity = state[type][index]

    entity.state.health -= BULLET_POWER

    if (entity.state.health <= 0) state[type].splice(index, 1)

    return true
  }

  const checkLimitsCollision = makeCheckLimitsCollision(map.width, map.height)
  const bulletCheckCollision = (position: ISimplePosition) =>
    checkLimitsCollision([position]) ||
    state.objects.some(
      (obj, index) =>
        position.x > obj.x &&
        position.x < obj.x + obj.width &&
        position.y > obj.y &&
        position.y < obj.y + obj.height &&
        decreaseHealth('objects', index)
    ) ||
    state.tanks.some((tank, index) => {
      const { body, cannon } = getRawTankPoints(
        tank.state.position.x,
        tank.state.position.y,
        tank.state.position.direction
      )

      return (
        (checkPointInRectangle(position, body) ||
          checkPointInRectangle(position, cannon)) &&
        decreaseHealth('tanks', index)
      )
    })

  const addBullet = (position: IPosition) => {
    const bullet = createBullet({
      defaultPos: position,
      checkCollision: bulletCheckCollision
    })

    state.bullets.push(bullet)
  }

  const tankCheckCollision = (id: string, points: ISimplePosition[]) =>
    checkLimitsCollision(points) ||
    checkPointsCollision(
      points,
      state.objects.reduce(
        (prevArr, obj) => prevArr.concat(obj.lines),
        [] as ILine[]
      )
    ) ||
    state.tanks.some(
      (tank) =>
        tank.id !== id &&
        checkPointsCollision(
          points,
          getLinesFromPoints(
            getTankPoints(
              tank.state.position.x,
              tank.state.position.y,
              tank.state.position.direction
            )
          )
        )
    )

  const getRandomPosition = () => {
    const x = Math.random() * map.width
    const y = Math.random() * map.height
    const direction = Math.random() * 360

    if (tankCheckCollision(null, getTankPoints(x, y, direction)))
      return getRandomPosition()

    return { x, y, direction }
  }

  const addTank = (id: string) => {
    const tank = createTank({
      addBullet,
      defaultPosition: getRandomPosition(),
      id,
      checkCollision: tankCheckCollision
    })

    state.tanks.push(tank)

    return tank
  }

  const removeTank = (id: string) => {
    state.tanks = state.tanks.filter((tank) => tank.id !== id)
  }

  const getState = (): IRawState => ({
    tanks: state.tanks.map((tank) => tank.getState()),
    objects: state.objects
  })

  const setState = (newState: { tanks: IRawTankState[] }) => {
    state.tanks = newState.tanks.map((tank) =>
      createTank({
        addBullet,
        defaultPosition: tank.state.position,
        defaultActions: tank.state.runningActions,
        id: tank.id,
        checkCollision: tankCheckCollision
      })
    )
  }

  const endGame = () => {
    clearInterval(interval)
  }

  return { state, addTank, endGame, removeTank, setState, getState }
}

export default createGame
