import { IMap } from '@tankz/game/types'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'

interface ICustomCanvasProps {
  orientation: 'portrait' | 'landscape'
}

const CustomCanvas = styled.canvas<ICustomCanvasProps>`
  max-${(props) =>
    props.orientation === 'landscape' ? 'width' : 'height'}: 100%;
`

interface IMapProps {
  map: IMap
  singleRender?: boolean
  drawFunction?: (ctx: CanvasRenderingContext2D) => void
}

const drawMap = (ctx: CanvasRenderingContext2D, map: IMap) => {
  ctx.fillStyle = `rgba(0, 0, 0, 1)`

  map.objects.forEach(({ x, y, width, height }) => {
    ctx.fillRect(x, y, width, height)
  })
}

const Map = ({
  map,
  singleRender,
  drawFunction = (ctx) => drawMap(ctx, map)
}: IMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')

    if (!ctx) return

    let animationCode: number

    const render = (ctx: CanvasRenderingContext2D, callback: Function) => {
      ctx.clearRect(0, 0, map.width, map.height)

      drawFunction(ctx)

      callback(ctx, callback)
    }

    render(
      ctx,
      !singleRender
        ? (ctx, callback) => {
            animationCode = requestAnimationFrame(() => render(ctx, callback))
          }
        : () => {}
    )

    return () => {
      if (animationCode) cancelAnimationFrame(animationCode)
    }
  }, [])

  return (
    <CustomCanvas
      orientation={map.width >= map.height ? 'landscape' : 'portrait'}
      width={map.width}
      height={map.height}
      ref={canvasRef}
    />
  )
}
export default Map
