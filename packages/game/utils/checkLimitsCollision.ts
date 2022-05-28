import { MAP_SIZE } from '../constants'
import { ISimplePosition } from '../types'
// import { IPosition } from '../factories/createGame'

const checkLimitsCollision = (points: ISimplePosition[]) =>
  points.some(
    ({ x, y }) => x < 0 || x > MAP_SIZE.width || y < 0 || y > MAP_SIZE.height
  )

export default checkLimitsCollision
