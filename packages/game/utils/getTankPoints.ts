import { TANK_SIZE } from '../constants'
import { IRectangle } from './checkPointInTank'

export interface IRawPoints {
  body: IRectangle
  cannon: IRectangle
}

export const getRawTankPoints = (
  tankX: number,
  tankY: number,
  tankDirection: number
): IRawPoints => {
  const radiansAngle = (Math.PI * tankDirection) / 180

  const rSin = Math.sin(radiansAngle)
  const rCos = Math.cos(radiansAngle)

  const xo = tankY + TANK_SIZE.height / 2
  const yo = tankX + TANK_SIZE.width / 2

  const bodyPoints = [
    { x: tankY + TANK_SIZE.canHeight, y: tankX },
    { x: tankY + TANK_SIZE.canHeight, y: tankX + TANK_SIZE.width },
    {
      x: tankY + TANK_SIZE.height,
      y: tankX + TANK_SIZE.width
    },
    { x: tankY + TANK_SIZE.height, y: tankX }
  ].map(({ x, y }) => {
    const xr = yo - (x - xo) * rSin + (y - yo) * rCos
    const yr = xo + (x - xo) * rCos + (y - yo) * rSin

    return { x: xr, y: yr }
  })

  const canPoints = [
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
  ].map(({ x, y }) => {
    const xr = yo - (x - xo) * rSin + (y - yo) * rCos
    const yr = xo + (x - xo) * rCos + (y - yo) * rSin

    return { x: xr, y: yr }
  })

  return { body: bodyPoints as IRectangle, cannon: canPoints as IRectangle }
}

const getTankPoints = (tankX: number, tankY: number, tankDirection: number) => {
  const { body, cannon } = getRawTankPoints(tankX, tankY, tankDirection)

  const [pointA, ...restPoints] = body

  return [pointA, ...cannon, ...restPoints]
}

export default getTankPoints
