import { MAP_SIZE } from '../constants'
import { IPosition } from '../createGame'

const checkLimitsCollision = (points: IPosition[]) =>
  points.some(
    ({ x, y }) => x < 0 || x > MAP_SIZE.width || y < 0 || y > MAP_SIZE.height
  )

export default checkLimitsCollision
