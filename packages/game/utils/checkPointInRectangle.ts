import { ISimplePosition } from '../types'

type ITriangle = [ISimplePosition, ISimplePosition, ISimplePosition]

export type IRectangle = [
  ISimplePosition,
  ISimplePosition,
  ISimplePosition,
  ISimplePosition
]

const checkPointInRectangle = (
  point: ISimplePosition,
  rectangle: IRectangle
): boolean => {
  const getTriangleArea = ([p1, p2, p3]: ITriangle) =>
    Math.abs(
      (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2
    )

  const A1 = getTriangleArea([point, rectangle[0], rectangle[1]])
  const A2 = getTriangleArea([point, rectangle[1], rectangle[2]])
  const A3 = getTriangleArea([point, rectangle[2], rectangle[3]])
  const A4 = getTriangleArea([point, rectangle[0], rectangle[3]])

  return (
    A1 + A2 + A3 + A4 <
    getTriangleArea([rectangle[0], rectangle[1], rectangle[2]]) +
      getTriangleArea([rectangle[0], rectangle[3], rectangle[2]])
  )
}

export default checkPointInRectangle
