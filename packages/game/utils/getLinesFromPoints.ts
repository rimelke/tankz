import { ISimplePosition } from '../types'
import { ILine } from './getLinesIntersection'

const getLinesFromPoints = (points: ISimplePosition[]) => {
  const tmpPoints = [...points, points[0]]

  const lines: ILine[] = []

  for (let i = 0; i < tmpPoints.length - 1; i++) {
    lines.push({
      point1: {
        x: tmpPoints[i].x,
        y: tmpPoints[i].y
      },
      point2: {
        x: tmpPoints[i + 1].x,
        y: tmpPoints[i + 1].y
      }
    })
  }

  return lines
}

export default getLinesFromPoints
