import { ISimplePosition } from '../types'

export interface ILine {
  point1: ISimplePosition
  point2: ISimplePosition
}

const getLinesIntersection = (line1: ILine, line2: ILine) => {
  if (
    (line1.point1.x === line1.point2.x && line1.point1.y === line1.point2.y) ||
    (line2.point1.x === line2.point2.x && line2.point1.y === line2.point2.y)
  )
    return false

  const denominator =
    (line2.point2.y - line2.point1.y) * (line1.point2.x - line1.point1.x) -
    (line2.point2.x - line2.point1.x) * (line1.point2.y - line1.point1.y)

  if (denominator === 0) return false

  const ua =
    ((line2.point2.x - line2.point1.x) * (line1.point1.y - line2.point1.y) -
      (line2.point2.y - line2.point1.y) * (line1.point1.x - line2.point1.x)) /
    denominator
  const ub =
    ((line1.point2.x - line1.point1.x) * (line1.point1.y - line2.point1.y) -
      (line1.point2.y - line1.point1.y) * (line1.point1.x - line2.point1.x)) /
    denominator

  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return false

  const x = line1.point1.x + ua * (line1.point2.x - line1.point1.x)
  const y = line1.point1.y + ua * (line1.point2.y - line1.point1.y)

  return { x, y }
}

export default getLinesIntersection
