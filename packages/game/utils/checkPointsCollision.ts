import { MAP_SIZE } from '../constants'
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

  return (
    points.some(
      ({ x, y }) => x < 0 || x > MAP_SIZE.width || y < 0 || y > MAP_SIZE.height
    ) ||
    otherLines.some((otherLine) =>
      lines.some((line) => getLinesIntersection(otherLine, line))
    )
    // map.some(({ x, y, width, height }) => {
    //   const mapLines: ILine[] = [
    //     { point1: { x, y }, point2: { x: x + width, y } },
    //     { point1: { x, y }, point2: { x, y: y + height } },
    //     {
    //       point1: { x: x + width, y },
    //       point2: { x: x + width, y: y + height }
    //     },
    //     {
    //       point1: { x, y: y + height },
    //       point2: { x: x + width, y: y + height }
    //     }
    //   ]

    //   return mapLines.some((mapLine) =>
    //     lines.some((line) => getLinesIntersection(mapLine, line))
    //   )
    // })
  )
}

export default checkPointsCollision
