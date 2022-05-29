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
}

const Map = ({ map }: IMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')

    if (!ctx) return

    const render = () => {
      ctx.fillStyle = `rgba(0, 0, 0, 1)`

      map.objects.forEach(({ x, y, width, height }) => {
        ctx.fillRect(x, y, width, height)
      })
    }

    render()
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
