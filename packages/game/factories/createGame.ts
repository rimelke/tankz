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

import { IMap, IPosition } from '../types'
import createBullet, { IBullet } from './createBullet'
import createTank, { ITank } from './createTank'

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

interface IState {
  tanks: ITank[]
  bullets: IBullet[]
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

export interface IGame {
  state: IState

  addTank: () => ITank
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

  const state: IState = {
    tanks: [],
    bullets: []
  }

  const interval = setInterval(() => {
    state.tanks.forEach((tank) => tank.runActions())
    state.bullets.forEach((bullet) => bullet.moveBullet())
  }, 10)

  const addBullet = (position: IPosition) => {
    const bullet = createBullet({
      defaultPos: position
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

  const addTank = () => {
    const tank = createTank({ addBullet, defaultPosition: getRandomPosition() })

    state.tanks.push(tank)

    return tank
  }

  const endGame = () => {
    clearInterval(interval)
  }

  return { state, addTank, endGame }
}

export default createGame
