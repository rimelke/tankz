import { ISimplePosition } from '../types'
import getLinesIntersection, { ILine } from './getLinesIntersection'

const checkPointsCollision = (
  points: ISimplePosition[],
  otherLines: ILine[]
) => {
  const aPoints = [...points, points[0]]

  const lines: ILine[] = []

  for (let i = 0; i < aPoints.length - 1; i++) {
    const line: ILine = {
      point1: {
        x: aPoints[i].x,
        y: aPoints[i].y
      },
      point2: {
        x: aPoints[i + 1].x,
        y: aPoints[i + 1].y
      }
    }

    lines.push(line)
  }

  return otherLines.some((otherLine) =>
    lines.some((line) => getLinesIntersection(otherLine, line))
  )
}

export default checkPointsCollision
