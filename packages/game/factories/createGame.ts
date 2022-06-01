// import {
//   BULLET_POWER,
//   DEFAULT_HEALTH,
//   MAP_SIZE,
//   STEP_BULLET
// } from '../constants'
// import createTank, { ITank } from './createTank'
// import map1 from '../maps/map1'
// import checkLimitsCollision from '../utils/checkLimitsCollision'
// import checkPointInTank from '../utils/checkPointInTank'
// import checkPointsCollision from '../utils/checkPointsCollision'
// import { ILine } from '../utils/getLinesIntersection'
// import getTankPoints, { getRawTankPoints } from '../utils/getTankPoints'

import { BULLET_POWER, DEFAULT_HEALTH } from '../constants'
import { IMap, IPosition, ISimplePosition, IMapObject } from '../types'
import createBullet, { IBullet } from './createBullet'
import createTank, { ITank, IRawTankState } from './createTank'
import makeCheckLimitsCollision from './makeCheckLimitsCollision'

// export interface IPosition {
//   x: number
//   y: number
// }

// interface IBullet {
//   pos: IPosition
//   direction: number
// }

// export interface IMapObject {
//   x: number
//   y: number
//   width: number
//   height: number
//   health?: number
//   lines: ILine[]
// }

// type IStatus = 'waiting' | 'running' | 'ended'

interface IGameObject extends IMapObject {
  state: {
    health: number
  }
}

export interface IGameState {
  tanks: ITank[]
  bullets: IBullet[]
  objects: IGameObject[]
}

// interface IGame {
//   tanks: ITank[]
//   bullets: IBullet[]
//   map: IMapObject[]
//   startedAt?: number
//   endedAt?: number
//   status: IStatus

//   addTank(id: string): ITank
//   endGame(): void
// }

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
  // const tanks: ITank[] = []
  // const bullets: IBullet[] = []
  // const map: IMapObject[] = Array.from(map1).map((obj) => ({
  //   ...obj,
  //   lines: [
  //     {
  //       point1: { x: obj.x, y: obj.y },
  //       point2: { x: obj.x + obj.width, y: obj.y }
  //     },
  //     {
  //       point1: { x: obj.x, y: obj.y },
  //       point2: { x: obj.x, y: obj.y + obj.height }
  //     },
  //     {
  //       point1: { x: obj.x + obj.width, y: obj.y },
  //       point2: { x: obj.x + obj.width, y: obj.y + obj.height }
  //     },
  //     {
  //       point1: { x: obj.x, y: obj.y + obj.height },
  //       point2: { x: obj.x + obj.width, y: obj.y + obj.height }
  //     }
  //   ]
  // }))
  // let status: IStatus = 'waiting'

  // const interval = setInterval(() => {

  // }, 10)

  // const checkTankCollision = (id: string, points: IPosition[]) =>
  //   checkLimitsCollision(points) ||
  //   checkPointsCollision(
  //     points,
  //     map.reduce((prevArr, obj) => prevArr.concat(obj.lines), [] as ILine[])
  //   ) ||
  //   tanks.some((tank) =>
  //     tank.id === id ? false : checkPointsCollision(points, tank.getTankLines())
  //   )

  // const addTank = (id: string) => {
  //   const getRandomPosition = () => {
  //     const x = Math.random() * MAP_SIZE.width
  //     const y = Math.random() * MAP_SIZE.height
  //     const direction = Math.random() * 360

  //     if (checkTankCollision(id, getTankPoints(x, y, direction)))
  //       return getRandomPosition()

  //     return { x, y, direction }
  //   }

  //   const tank = createTank({
  //     id,
  //     defaultPos: getRandomPosition(),
  //     addBullet: (pos, direction) => bullets.push({ pos, direction }),
  //     checkCollision: (points) => checkTankCollision(id, points)
  //   })

  //   tanks.push(tank)

  //   return tank
  // }

  // const endGame = () => {
  //   clearInterval(interval)
  //   status = 'ended'
  // }

  // return {
  //   bullets,
  //   map,
  //   status,
  //   tanks,
  //   endGame,
  //   // startAction,
  //   // stopAction,
  //   // singleAction,
  //   addTank
  // }

  const state: IGameState = {
    tanks: [],
    bullets: [],
    objects: map.objects.map((obj) => ({
      ...obj,
      state: {
        health: DEFAULT_HEALTH
      }
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
    )

  const addBullet = (position: IPosition) => {
    const bullet = createBullet({
      defaultPos: position,
      checkCollision: bulletCheckCollision
    })

    state.bullets.push(bullet)
  }

  const getRandomPosition = () => {
    const x = Math.random() * map.width
    const y = Math.random() * map.height
    const direction = Math.random() * 360

    // if (checkTankCollision(id, getTankPoints(x, y, direction)))
    //   return getRandomPosition()

    return { x, y, direction }
  }

  const addTank = (id: string) => {
    const tank = createTank({
      addBullet,
      defaultPosition: getRandomPosition(),
      id
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
        id: tank.id
      })
    )
  }

  const endGame = () => {
    clearInterval(interval)
  }

  return { state, addTank, endGame, removeTank, setState, getState }
}

export default createGame
