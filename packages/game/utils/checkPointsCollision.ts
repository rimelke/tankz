import { IPosition } from '../createGame'
import getLinesIntersection, { ILine } from './getLinesIntersection'

const checkPointsCollision = (points: IPosition[], otherLines: ILine[]) => {
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

  const x = otherLines.some((otherLine) =>
    lines.some((line) => getLinesIntersection(otherLine, line))
  )

  console.log('lines', lines)
  console.log('otherLines', otherLines)
  console.log('x', x)

  return x
}

export default checkPointsCollision
