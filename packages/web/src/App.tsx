import { useEffect, useRef } from 'react'

interface IMapObject {
  x: number
  y: number
  width: number
  height: number
}

const map: IMapObject[] = [
  {
    x: 362,
    y: 353,
    width: 70,
    height: 70
  },
  {
    x: 558,
    y: 57,
    width: 70,
    height: 70
  },
  {
    x: 100,
    y: 170,
    width: 70,
    height: 70
  },
  {
    x: 670,
    y: 306,
    width: 130,
    height: 20
  },
  {
    x: 212,
    y: 381,
    width: 20,
    height: 119
  },
  {
    x: 432,
    y: 353,
    width: 70,
    height: 20
  },
  {
    x: 608,
    y: 127,
    width: 20,
    height: 60
  },
  {
    x: 352,
    y: 153,
    width: 20,
    height: 60
  },
  {
    x: 0,
    y: 326,
    width: 90,
    height: 20
  },
  {
    x: 264,
    y: 213,
    width: 215,
    height: 20
  },
  {
    x: 140,
    y: 0,
    width: 20,
    height: 80
  }
]

interface IFigure {
  x: number
  y: number
  width: number
  height: number
  color: string
}

const tankFigures: IFigure[] = [
  {
    x: 10,
    y: 28,
    width: 21,
    height: 6,
    color: '#000000'
  },
  {
    x: 18,
    y: 5,
    width: 4,
    height: 23,
    color: '#999999'
  },
  {
    x: 16,
    y: 0,
    width: 8,
    height: 10,
    color: '#000000'
  },
  {
    x: 3,
    y: 41,
    width: 34,
    height: 21,
    color: '#D9D9D9'
  },
  {
    x: 29,
    y: 23,
    width: 11,
    height: 21,
    color: '#697094'
  },
  {
    x: 0,
    y: 23,
    width: 11,
    height: 21,
    color: '#697094'
  },
  {
    x: 29,
    y: 50,
    width: 11,
    height: 20,
    color: '#697094'
  },
  {
    x: 0,
    y: 50,
    width: 11,
    height: 20,
    color: '#697094'
  },
  {
    x: 7,
    y: 33,
    width: 26,
    height: 25,
    color: '#555555'
  }
]

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')

    if (!ctx) return

    let animationCode: number

    const tank = {
      figures: tankFigures,
      rotation: 90,
      width: 40,
      height: 70,
      can: 69 - 46,
      canW: 8,
      x: 20,
      y: 0
    }

    const render = (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, 800, 500)

      ctx.fillStyle = '#000000'
      map.forEach(({ x, y, width, height }) => {
        ctx.fillRect(x, y, width, height)
      })

      const initialX = tank.width / 2
      const initialY = tank.height / 2
      const rAngle = (Math.PI * tank.rotation) / 180
      ctx.translate(tank.x + initialX, tank.y + initialY)
      ctx.rotate(rAngle)
      tank.figures.forEach(({ x, y, width, height, color }) => {
        ctx.fillStyle = color
        ctx.fillRect(x - initialX, y - initialY, width, height)
      })
      ctx.rotate(-rAngle)
      ctx.translate(-(tank.x + initialX), -(initialY + tank.y))

      animationCode = requestAnimationFrame(() => render(ctx))
    }

    render(ctx)

    const STEP_ROTATION = 0.75
    const STEP_MOVE = 0.75

    const keyMap: Record<string, boolean> = {}
    document.onkeydown = (e) => {
      keyMap[e.key] = true
    }

    document.onkeyup = (e) => {
      keyMap[e.key] = false
    }

    const getTankBoundaries = (
      tankX: number,
      tankY: number,
      rotation: number
    ) => {
      const radiansAngle = (Math.PI * rotation) / 180

      const rSin = Math.sin(radiansAngle)
      const rCos = Math.cos(radiansAngle)

      const xo = tankY + tank.height / 2
      const yo = tankX + tank.width / 2

      const bodyPoints: { x: number; y: number }[] = [
        { x: tankY + tank.can, y: tankX },
        { x: tankY + tank.can, y: tankX + tank.width },
        { x: tankY + tank.height, y: tankX + tank.width },
        { x: tankY + tank.height, y: tankX }
      ]
        .map(({ x, y }) => {
          const xr = yo - (x - xo) * rSin + (y - yo) * rCos
          const yr = xo + (x - xo) * rCos + (y - yo) * rSin

          return { x: xr, y: yr }
        })
        .sort((a, b) => a.x + a.y - (b.x + b.y))

      const canPoints: { x: number; y: number }[] = [
        { x: tankY, y: tankX + (tank.width - tank.canW) / 2 },
        { x: tankY, y: tankX + (tank.width + tank.canW) / 2 },
        { x: tankY + tank.can, y: tankX + (tank.width + tank.canW) / 2 },
        { x: tankY + tank.can, y: tankX + (tank.width - tank.canW) / 2 }
      ]
        .map(({ x, y }) => {
          const xr = yo - (x - xo) * rSin + (y - yo) * rCos
          const yr = xo + (x - xo) * rCos + (y - yo) * rSin

          return { x: xr, y: yr }
        })
        .sort((a, b) => a.x + a.y - (b.x + b.y))

      return { bodyPoints, canPoints }
    }

    const intersect = (
      line1: { x1: number; y1: number; x2: number; y2: number },
      line2: { x1: number; y1: number; x2: number; y2: number }
    ) => {
      if (
        (line1.x1 === line1.x2 && line1.y1 === line1.y2) ||
        (line2.x1 === line2.x2 && line2.y1 === line2.y2)
      )
        return false

      const denominator =
        (line2.y2 - line2.y1) * (line1.x2 - line1.x1) -
        (line2.x2 - line2.x1) * (line1.y2 - line1.y1)

      if (denominator === 0) return false

      const ua =
        ((line2.x2 - line2.x1) * (line1.y1 - line2.y1) -
          (line2.y2 - line2.y1) * (line1.x1 - line2.x1)) /
        denominator
      const ub =
        ((line1.x2 - line1.x1) * (line1.y1 - line2.y1) -
          (line1.y2 - line1.y1) * (line1.x1 - line2.x1)) /
        denominator

      if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return false

      const x = line1.x1 + ua * (line1.x2 - line1.x1)
      const y = line1.y1 + ua * (line1.y2 - line1.y1)

      return { x, y }
    }

    const isCollision = (x: number, y: number, rotation: number) => {
      const points = getTankBoundaries(x, y, rotation)

      return (
        points.bodyPoints.some(
          ({ x, y }) => x < 0 || x > 800 || y < 0 || y > 500
        ) ||
        points.canPoints
          .slice(0, 2)
          .some(({ x, y }) => x < 0 || x > 800 || y < 0 || y > 500) ||
        map.some(({ x, y, width, height }) => {
          const lines = [
            { x1: x, y1: y, x2: x + width, y2: y },
            { x1: x, y1: y, x2: x, y2: y + height },
            { x1: x + width, y1: y, x2: x + width, y2: y + height },
            { x1: x, y1: y + height, x2: x + width, y2: y + height }
          ]

          const aPoints = [
            ...points.bodyPoints,
            ...points.canPoints,
            points.bodyPoints[0]
          ]

          const tankLines = []

          for (let i = 0; i < aPoints.length - 1; i++) {
            const line = {
              x1: aPoints[i].x,
              y1: aPoints[i].y,
              x2: aPoints[i + 1].x,
              y2: aPoints[i + 1].y
            }

            tankLines.push(line)
          }

          return tankLines.some((line) => lines.some((l) => intersect(line, l)))
        })
      )
    }

    const moveTank = (step: number) => {
      const radiansAngle = (Math.PI * tank.rotation) / 180

      const rSin = Math.sin(radiansAngle)
      const rCos = Math.cos(radiansAngle)

      const newX = tank.x + step * rSin
      const newY = tank.y - step * rCos

      if (isCollision(newX, newY, tank.rotation)) return

      tank.x = newX
      tank.y = newY
    }

    const rotateTank = (step: number) => {
      const newRotation = tank.rotation + step

      if (isCollision(tank.x, tank.y, newRotation)) return

      tank.rotation = newRotation
    }

    const interval = setInterval(() => {
      if (keyMap.ArrowLeft || keyMap.a) rotateTank(-STEP_ROTATION)
      if (keyMap.ArrowRight || keyMap.d) rotateTank(STEP_ROTATION)
      if (keyMap.ArrowUp || keyMap.w) moveTank(STEP_MOVE)
      if (keyMap.ArrowDown || keyMap.s) moveTank(-STEP_MOVE)
    }, 10)

    return () => {
      cancelAnimationFrame(animationCode)
      document.onkeydown = null
      document.onkeyup = null
      clearInterval(interval)
    }
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{ border: '10px solid #777' }}
      />
    </div>
  )
}

export default App
