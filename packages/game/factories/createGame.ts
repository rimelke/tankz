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

export type IGameStatus =
  | 'init'
  | 'waiting'
  | 'preparing'
  | 'starting'
  | 'playing'
  | 'paused'

export interface IGameState {
  status: IGameStatus
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
  getCountdown: () => number
  setState: (state: IRawState) => void
  endGame: () => void

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
    status: null,
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

  const checkLimitsCollision = makeCheckLimitsCollision(map.width, map.height)
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

  const statusData: {
    timeoutCountdown: any
    startTime: number
    endTime: number
    statusInfo: Partial<
      Record<
        IGameStatus,
        {
          time: number
          action: () => void
        }
      >
    >
  } = {
    timeoutCountdown: null,
    startTime: null,
    endTime: null,
    statusInfo: {}
  }

  let playStartTime: number
  const endGame = () => {
    clearTimeout(statusData.timeoutCountdown)
    clearInterval(interval)
    clearInterval(stateInterval)

    if (state.status !== 'playing' || state.tanks.length === 0) {
      notifyAll({
        type: 'gameEnded',
        payload: {}
      })

      return
    }

    const winnerId = state.tanks.reduce(
      (prev, tank) => (tank.state.health > prev.state.health ? tank : prev),
      state.tanks[0]
    ).id

    notifyAll({
      type: 'gameEnded',
      payload: {
        winnerId,
        duration:
          playStartTime && Math.round((Date.now() - playStartTime) / 1000)
      }
    })

    observers.splice(0, observers.length)
  }

  const setStatus = (newStatus: IGameStatus) => {
    state.status = newStatus
    statusData.startTime = Date.now()
    if (newStatus === 'playing') playStartTime = statusData.startTime

    const setCountdown = () => {
      clearTimeout(statusData.timeoutCountdown)

      if (!statusData.statusInfo[newStatus]) {
        statusData.endTime = null
        statusData.timeoutCountdown = null
        return
      }

      statusData.endTime =
        statusData.startTime + statusData.statusInfo[newStatus].time * 1000
      const now = Date.now()
      const timeLeft = statusData.endTime - now

      statusData.timeoutCountdown = setTimeout(() => {
        statusData.statusInfo[newStatus].action()
      }, timeLeft)

      return statusData.statusInfo[newStatus].time
    }

    const countdown = setCountdown()

    notifyAll({
      type: 'statusChanged',
      payload: {
        status: newStatus,
        countdown
      }
    })
  }

  const setState = (newState: IRawState) => {
    state.objects = newState.objects
    state.tanks.forEach((tank) =>
      tank.setState(
        newState.tanks.find((t) => t.id === tank.id)?.state || tank.state
      )
    )
  }

  statusData.statusInfo.init = {
    time: 10,
    action: () => endGame()
  }
  statusData.statusInfo.preparing = {
    time: 60,
    action: () => setStatus('starting')
  }
  statusData.statusInfo.starting = {
    time: 10,
    action: () => {
      setState({
        objects: getObjects(),
        tanks: state.tanks.map((tank) => ({
          ...tank,
          state: {
            health: DEFAULT_HEALTH,
            position: getRandomPosition()
          }
        }))
      })
      setStatus('playing')
    }
  }
  statusData.statusInfo.playing = {
    time: 180,
    action: () => endGame()
  }
  statusData.statusInfo.paused = {
    time: 10,
    action: () => (state.tanks.length > 1 ? setStatus('playing') : endGame())
  }

  const removeTank = (id: string, wasKilled?: boolean) => {
    const index = state.tanks.findIndex((tank) => tank.id === id)

    if (index === -1) return

    const [tank] = state.tanks.splice(index, 1)

    notifyAll({
      type: 'removeTank',
      payload: {
        id
      }
    })

    tank.unsubscribe(getTankNotifier(id))

    if (wasKilled) {
      if (state.tanks.length === 1) endGame()

      return
    }

    if (state.status === 'waiting') endGame()
    else if (
      (state.status === 'preparing' || state.status === 'starting') &&
      state.tanks.length < 2
    )
      setStatus('waiting')
    else if (state.status === 'playing' || state.status === 'paused')
      setStatus('paused')
  }

  const decreaseHealth = (type: 'tanks' | 'objects', index: number) => {
    const entity = state[type][index]

    entity.state.health -= BULLET_POWER

    if (type === 'tanks') {
      notifyAll({
        type: 'tankHealthChanged',
        payload: {
          id: (entity as ITank).id,
          health: entity.state.health
        }
      })
    }

    if (entity.state.health <= 0) {
      if (type === 'tanks') {
        if (state.status === 'playing') removeTank((entity as ITank).id, true)
        else {
          const tank = state.tanks.find(
            (tank) => tank.id === (entity as ITank).id
          )

          tank.setState({
            health: DEFAULT_HEALTH,
            position: tank.state.position
          })
        }
      } else state[type].splice(index, 1)

      notifyAll({
        type: 'stateChanged',
        payload: getState()
      })
    }

    return true
  }

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

    if (state.status === 'init') setStatus('waiting')
    else if (state.status === 'waiting') setStatus('preparing')

    return tank
  }

  const getCountdown = () =>
    statusData.endTime && Math.ceil((statusData.endTime - Date.now()) / 1000)

  setStatus('init')

  return {
    state,
    getCountdown,
    addTank,
    endGame,
    removeTank,
    setState,
    getState,
    subscribe,
    unsubscribe,
    addBullet
  }
}

export default createGame
