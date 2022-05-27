import { TANK_SIZE } from '../constants'
import { IPosition } from '../createGame'
import { IRawPoints } from './getTankPoints'

type ITriangle = [IPosition, IPosition, IPosition]
export type IRectangle = [IPosition, IPosition, IPosition, IPosition]

const TANK_AREA =
  TANK_SIZE.width * TANK_SIZE.height + TANK_SIZE.canWidth * TANK_SIZE.canHeight

const checkPointInTank = (
  point: IPosition,
  { body, cannon }: IRawPoints
): boolean => {
  const getTriangleArea = (triangle: ITriangle) => {
    const [p1, p2, p3] = triangle

    const a = Math.abs(
      (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2
    )

    return a
  }

  const getRectangleArea = (rectangle: IRectangle) => {
    const tmpRectangle = [...rectangle, rectangle[0]]

    const triangles: ITriangle[] = []

    for (let i = 0; i < tmpRectangle.length - 1; i++) {
      triangles.push([tmpRectangle[i], point, tmpRectangle[i + 1]])
    }

    return triangles.reduce(
      (acc, triangle) => acc + getTriangleArea(triangle),
      0
    )
  }

  return getRectangleArea(body) + getRectangleArea(cannon) <= TANK_AREA
}

export default checkPointInTank
