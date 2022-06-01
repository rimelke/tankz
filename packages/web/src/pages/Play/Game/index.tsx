import createGame, { IGame } from '@tankz/game'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import Map from '../../../components/Map'
import * as maps from '@tankz/game/maps'
import Loading from '../../../components/Loading'
import { Container, MapContainer } from './styled'
import { TANK_SIZE } from '@tankz/game/constants'
import * as tanksTypes from '../../../constants/tanks'
import {
  IContinuosAction,
  ISingleAction,
  ITank
} from '@tankz/game/factories/createTank'
// import { ITank } from '@tankz/game/factories/createTank'

interface IGameData {
  map: keyof typeof maps
}

const continuosKeys: Record<string, IContinuosAction> = {
  ArrowUp: 'MoveForward',
  ArrowDown: 'MoveBackward',
  ArrowLeft: 'TurnLeft',
  ArrowRight: 'TurnRight',
  w: 'MoveForward',
  s: 'MoveBackward',
  a: 'TurnLeft',
  d: 'TurnRight'
}

const singleKeys: Record<string, ISingleAction> = {
  Space: 'Fire'
}

const PlayGame = () => {
  const { id } = useParams()

  const canvasRef = useRef<HTMLCanvasElement>()
  const gameRef = useRef<IGame>()
  const tankRef = useRef<ITank>()

  const [gameData, setGameData] = useState<IGameData | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !gameData) return

    const ctx = canvasRef.current.getContext('2d')

    if (!ctx) return

    const game: IGame = gameRef.current
    const tank: ITank = tankRef.current

    let animationCode: number

    const render = (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = '#555555'

      game.state.bullets.forEach((bullet) => {
        ctx.beginPath()
        ctx.arc(
          bullet.state.position.x,
          bullet.state.position.y,
          3,
          0,
          Math.PI * 2
        )
        ctx.fill()
      })

      game.state.tanks.forEach((tank) => {
        const initialX = TANK_SIZE.width / 2
        const initialY = TANK_SIZE.height / 2
        const rAngle = (Math.PI * tank.state.position.direction) / 180

        ctx.translate(
          tank.state.position.x + initialX,
          tank.state.position.y + initialY
        )
        ctx.rotate(rAngle)
        tanksTypes.model1.forEach(({ x, y, width, height, color }) => {
          ctx.fillStyle = color
          ctx.fillRect(x - initialX, y - initialY, width, height)
        })
        ctx.rotate(-rAngle)
        ctx.translate(
          -(tank.state.position.x + initialX),
          -(initialY + tank.state.position.y)
        )
      })

      animationCode = requestAnimationFrame(() => render(ctx))
    }

    render(ctx)

    document.onkeydown = (e) => {
      if (continuosKeys[e.key]) tank.startAction(continuosKeys[e.key])
    }

    document.onkeyup = (e) => {
      if (continuosKeys[e.key]) tank.stopAction(continuosKeys[e.key])

      if (singleKeys[e.code]) tank.makeSingleAction(singleKeys[e.code])
    }

    return () => {
      cancelAnimationFrame(animationCode)
      document.onkeydown = null
      document.onkeyup = null
    }
  }, [gameData])

  useEffect(() => {
    if (!id) return

    const socket = io('ws://localhost:4000', {
      auth: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOTYyNTA3NzEwMDI4YzZkZmEzNWFmNiIsImlhdCI6MTY1NDAxMTEwMywiZXhwIjoxNjU0NjE1OTAzfQ.8U6TICBsm89-JlTjlCLviEWZu8muN_VQ290rK82x0q0'
      }
    })

    socket.on('error', (err) => {
      console.error(err)
    })

    socket.on('setup', (data) => {
      const game = createGame({ map: data.map })
      game.setState(data.state)

      gameRef.current = game

      tankRef.current = game.state.tanks.find((t) => t.id === data.id)

      setGameData({ map: data.map })
    })

    socket.emit('joinGame', id)
  }, [])

  if (!gameData) return <Loading />

  return (
    <Container>
      <MapContainer>
        <Map foreverRender ref={canvasRef} map={maps[gameData.map]} />
      </MapContainer>
    </Container>
  )
}

export default PlayGame
