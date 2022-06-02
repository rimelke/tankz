import { BULLET_POWER, DEFAULT_HEALTH } from '../constants'
import {
  IMap,
  IPosition,
  ISimplePosition,
  IMapObject,
  IObserver,
  IEvent
} from '../types'
import checkPointInRectangle from '../utils/checkPointInRectangle'
import checkPointsCollision from '../utils/checkPointsCollision'
import getLinesFromPoints from '../utils/getLinesFromPoints'
import { ILine } from '../utils/getLinesIntersection'
import getTankPoints, { getRawTankPoints } from '../utils/getTankPoints'
import createBullet, { IBullet } from './createBullet'
import createTank, { ITank } from './createTank'
import makeCheckLimitsCollision from './makeCheckLimitsCollision'

interface IGameObject extends IMapObject {
  state: {
    health: number
  }
  lines: ILine[]
}

export interface IGameState {
  status: 'waiting' | 'playing'
  tanks: ITank[]
  bullets: IBullet[]
  objects: IGameObject[]
}

interface IRawState {
  tanks: ITank[]
  objects: IGameObject[]
}

export interface IGame {
  state: IGameState

  addTank: (id: string, position?: IPosition) => ITank
  removeTank: (id: string) => void
  addBullet: (position: IPosition) => void
  getState: () => IRawState
  setState: (state: IRawState) => void
  endGame: () => void
  startGame: () => void

  subscribe: (observer: IObserver) => void
  unsubscribe: (observer: IObserver) => void
}

interface ICreateGameProps {
  map: IMap
}

const createGame = ({ map }: ICreateGameProps): IGame => {
  const getObjects = (): IGameObject[] =>
    map.objects.map((obj) => ({
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

  const state: IGameState = {
    status: 'waiting',
    tanks: [],
    bullets: [],
    objects: getObjects()
  }

  const observers: IObserver[] = []

  const notifyAll = (event: IEvent) => {
    observers.forEach((observer) => observer(event))
  }

  const subscribe = (observer: IObserver) => {
    observers.push(observer)
  }

  const unsubscribe = (observer: IObserver) => {
    observers.splice(observers.indexOf(observer), 1)
  }

  const interval = setInterval(() => {
    state.bullets.forEach(
      (bullet, index) => !bullet.moveBullet() && state.bullets.splice(index, 1)
    )
  }, 10)

  const getState = (): IRawState => ({
    tanks: state.tanks,
    objects: state.objects
  })

  const stateInterval = setInterval(() => {
    notifyAll({
      type: 'stateChanged',
      payload: getState()
    })
  }, 500)

  const decreaseHealth = (type: 'tanks' | 'objects', index: number) => {
    const entity = state[type][index]

    entity.state.health -= BULLET_POWER

    if (entity.state.health <= 0) {
      state[type].splice(index, 1)

      notifyAll({
        type: 'stateChanged',
        payload: getState()
      })
    }

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

    notifyAll({
      type: 'bulletAdded',
      payload: position
    })
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

  const getTankNotifier = (id: string) => (event: IEvent) => {
    notifyAll({
      type: event.type,
      payload: {
        id,
        payload: event.payload
      }
    })
  }

  const addTank = (id: string, position?: IPosition) => {
    const defaultPosition = position || getRandomPosition()

    const tank = createTank({
      addBullet,
      defaultPosition,
      id,
      checkCollision: tankCheckCollision
    })

    tank.subscribe(getTankNotifier(id))

    state.tanks.push(tank)

    notifyAll({
      type: 'addTank',
      payload: {
        id,
        position: defaultPosition
      }
    })

    return tank
  }

  const removeTank = (id: string) => {
    const [tank] = state.tanks.splice(
      state.tanks.findIndex((tank) => tank.id === id),
      1
    )

    notifyAll({
      type: 'removeTank',
      payload: {
        id
      }
    })

    tank.unsubscribe(getTankNotifier(id))
  }

  const setState = (newState: IRawState) => {
    state.objects = newState.objects
    state.tanks.forEach((tank) =>
      tank.setState(
        newState.tanks.find((t) => t.id === tank.id)?.state || tank.state
      )
    )
  }

  const endGame = () => {
    clearInterval(interval)
    clearInterval(stateInterval)
  }

  const startGame = () => {
    const COUNTDOWN = 10 * 1000

    notifyAll({
      type: 'startCountdown',
      payload: COUNTDOWN
    })

    setTimeout(() => {
      state.status = 'playing'

      state.bullets = []
      state.objects = getObjects()
      state.tanks.forEach((tank) => {
        tank.state.position = getRandomPosition()
        tank.state.health = DEFAULT_HEALTH
      })

      notifyAll({
        type: 'startGame',
        payload: getState()
      })
    }, COUNTDOWN)
  }

  return {
    state,
    addTank,
    endGame,
    removeTank,
    setState,
    getState,
    subscribe,
    unsubscribe,
    addBullet,
    startGame
  }
}

export default createGame
