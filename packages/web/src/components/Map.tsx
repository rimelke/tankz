import { IMap } from '@tankz/game/types'
import { ForwardedRef, forwardRef, useEffect, useRef } from 'react'
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
  foreverRender?: boolean
}

const MapWithoutRef = (
  { map, foreverRender }: IMapProps,
  ref: ForwardedRef<HTMLCanvasElement>
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')

    if (!ctx) return

    let animationCode: number

    const render = (ctx: CanvasRenderingContext2D, callback: Function) => {
      ctx.clearRect(0, 0, map.width, map.height)

      ctx.fillStyle = `rgba(0, 0, 0, 1)`

      map.objects.forEach(({ x, y, width, height }) => {
        ctx.fillRect(x, y, width, height)
      })

      callback(ctx, callback)
    }

    render(
      ctx,
      foreverRender
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
      ref={(node) => {
        canvasRef.current = node
        if (ref) typeof ref === 'function' ? ref(node) : (ref.current = node)
      }}
    />
  )
}

const Map = forwardRef<HTMLCanvasElement, IMapProps>(MapWithoutRef)

export default Map
