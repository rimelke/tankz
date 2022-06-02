import createGame, { IGame } from '@tankz/game'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import Map from '../../../components/Map'
import * as maps from '@tankz/game/maps'
import Loading from '../../../components/Loading'
import Error from '../../../components/Error'
import { Container, MapContainer } from './styled'
import { TANK_SIZE } from '@tankz/game/constants'
import * as tanksTypes from '../../../constants/tanks'
import {
  IContinuosAction,
  ISingleAction,
  ITank
} from '@tankz/game/factories/createTank'
import { getAuthorization } from '../../../contexts/AuthContext'
import Back from '../../../components/Back'

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

  const gameRef = useRef<IGame>()
  const tankRef = useRef<ITank>()

  const [gameData, setGameData] = useState<IGameData | null>(null)
  const [error, setError] = useState()

  useEffect(() => {
    if (!gameData) return

    const tank: ITank = tankRef.current

    document.onkeydown = (e) => {
      if (continuosKeys[e.key]) tank.startAction(continuosKeys[e.key])
    }

    document.onkeyup = (e) => {
      if (continuosKeys[e.key]) tank.stopAction(continuosKeys[e.key])

      if (singleKeys[e.code]) tank.makeSingleAction(singleKeys[e.code])
    }

    return () => {
      document.onkeydown = null
      document.onkeyup = null
    }
  }, [gameData])

  useEffect(() => {
    if (!id) return

    const socket = io('ws://localhost:4000', {
      auth: {
        authorization: getAuthorization()
      }
    })

    socket.on('error', (err) => {
      console.error(err)
      socket.disconnect()
      setError(err.message)
    })

    socket.on('setup', (data) => {
      const game = createGame({ map: maps[data.map] })
      game.setState(data.state)

      gameRef.current = game

      tankRef.current = game.state.tanks.find((t) => t.id === data.id)

      setGameData({ map: data.map })
    })

    socket.on('addTank', (data) => {
      gameRef.current.addTank(data.id, data.position)
    })

    socket.on('removeTank', (data) => {
      gameRef.current.removeTank(data.id)
    })

    socket.emit('joinGame', id)

    return () => {
      socket.disconnect()
    }
  }, [])

  const drawGame = (ctx: CanvasRenderingContext2D) => {
    if (!gameRef.current) return

    gameRef.current.state.objects.forEach((obj) => {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.ceil(obj.state.health / 10) / 10})`
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
    })

    ctx.fillStyle = '#555555'

    gameRef.current.state.bullets.forEach((bullet) => {
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

    gameRef.current.state.tanks.forEach((tank) => {
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
  }

  if (error) return <Error>{error}</Error>
  if (!gameData) return <Loading />

  return (
    <Container>
      <Back />
      <MapContainer>
        <Map drawFunction={drawGame} map={maps[gameData.map]} />
      </MapContainer>
    </Container>
  )
}

export default PlayGame
