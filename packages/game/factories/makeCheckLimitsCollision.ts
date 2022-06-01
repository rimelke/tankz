import { ISimplePosition } from '../types'

export type CheckLimitsCollision = (points: ISimplePosition[]) => boolean

const makeCheckLimitsCollision =
  (width: number, height: number): CheckLimitsCollision =>
  (points: ISimplePosition[]) =>
    points.some(({ x, y }) => x < 0 || x > width || y < 0 || y > height)

export default makeCheckLimitsCollision
