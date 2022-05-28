import { TANK_SIZE } from '../constants'
import { IPosition } from '../createGame'
import { IRawPoints } from './getTankPoints'

type ITriangle = [IPosition, IPosition, IPosition]
export type IRectangle = [IPosition, IPosition, IPosition, IPosition]

const TANK_BODY_AREA =
  TANK_SIZE.width * (TANK_SIZE.height - TANK_SIZE.canHeight) * 100
const TANK_CANNON_AREA = TANK_SIZE.canWidth * TANK_SIZE.canHeight * 100

const checkPointInTank = (
  point: IPosition,
  { body, cannon }: IRawPoints
): boolean => {
  const getTriangleArea = ([p1, p2, p3]: ITriangle) =>
    Math.abs(
      (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2
    )

  const checkPointInRectangle = (
    rectangle: IRectangle,
    comparisonArea: number
  ) => {
    const A1 = getTriangleArea([point, rectangle[0], rectangle[1]])
    const A2 = getTriangleArea([point, rectangle[1], rectangle[2]])
    const A3 = getTriangleArea([point, rectangle[2], rectangle[3]])
    const A4 = getTriangleArea([point, rectangle[0], rectangle[3]])

    return Math.round((A1 + A2 + A3 + A4) * 100) <= comparisonArea
  }

  return (
    checkPointInRectangle(body, TANK_BODY_AREA) ||
    checkPointInRectangle(cannon, TANK_CANNON_AREA)
  )
}

export default checkPointInTank
