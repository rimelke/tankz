import { ISimplePosition } from '../types'
import getLinesIntersection, { ILine } from './getLinesIntersection'
import getLinesFromPoints from './getLinesFromPoints'

const checkPointsCollision = (
  points: ISimplePosition[],
  otherLines: ILine[]
) => {
  const lines = getLinesFromPoints(points)

  return otherLines.some((otherLine) =>
    lines.some((line) => getLinesIntersection(otherLine, line))
  )
}

export default checkPointsCollision
