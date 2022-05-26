import { TANK_SIZE } from '../constants'

const getTankPoints = (tankX: number, tankY: number, tankDirection: number) => {
  const radiansAngle = (Math.PI * tankDirection) / 180

  const rSin = Math.sin(radiansAngle)
  const rCos = Math.cos(radiansAngle)

  const xo = tankY + TANK_SIZE.height / 2
  const yo = tankX + TANK_SIZE.width / 2

  const bodyPoints: { x: number; y: number }[] = [
    { x: tankY + TANK_SIZE.canHeight, y: tankX },
    { x: tankY + TANK_SIZE.canHeight, y: tankX + TANK_SIZE.width },
    { x: tankY + TANK_SIZE.height, y: tankX + TANK_SIZE.width },
    { x: tankY + TANK_SIZE.height, y: tankX }
  ]
    .map(({ x, y }) => {
      const xr = yo - (x - xo) * rSin + (y - yo) * rCos
      const yr = xo + (x - xo) * rCos + (y - yo) * rSin

      return { x: xr, y: yr }
    })
    .sort((a, b) => a.x + a.y - (b.x + b.y))

  const canPoints: { x: number; y: number }[] = [
    { x: tankY, y: tankX + (TANK_SIZE.width - TANK_SIZE.canWidth) / 2 },
    { x: tankY, y: tankX + (TANK_SIZE.width + TANK_SIZE.canWidth) / 2 },
    {
      x: tankY + TANK_SIZE.canHeight,
      y: tankX + (TANK_SIZE.width + TANK_SIZE.canWidth) / 2
    },
    {
      x: tankY + TANK_SIZE.canHeight,
      y: tankX + (TANK_SIZE.width - TANK_SIZE.canWidth) / 2
    }
  ]
    .map(({ x, y }) => {
      const xr = yo - (x - xo) * rSin + (y - yo) * rCos
      const yr = xo + (x - xo) * rCos + (y - yo) * rSin

      return { x: xr, y: yr }
    })
    .sort((a, b) => a.x + a.y - (b.x + b.y))

  return [...bodyPoints, ...canPoints]
}

export default getTankPoints
