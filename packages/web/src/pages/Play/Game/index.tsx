import createGame, { IGame, IGameStatus } from '@tankz/game'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import Map from '../../../components/Map'
import * as maps from '@tankz/game/maps'
import Loading from '../../../components/Loading'
import Error from '../../../components/Error'
import {
  UpContainer,
  Container,
  HealthBar,
  HealthContainer,
  InfoContainer,
  MapContainer,
  EndGameContainer
} from './styled'
import { DEFAULT_HEALTH, TANK_SIZE } from '@tankz/game/constants'
import * as tanksTypes from '../../../constants/tanks'
import { getAuthorization } from '../../../contexts/AuthContext'
import Back from '../../../components/Back'
import makeKeyboardListener from '../../../factories/makeKeyboardListener'
import Button from '../../../components/Button'

interface IGameData {
  map: keyof typeof maps
  status: IGameStatus
  winnerId?: string
}

const PlayGame = () => {
  const { id } = useParams()

  const gameRef = useRef<IGame>()
  const tankIdRef = useRef<string>()
  const drawCountRef = useRef<number>()

  const [gameData, setGameData] = useState<IGameData | null>(null)
  const [error, setError] = useState()
  const [health, setHealth] = useState(DEFAULT_HEALTH)
  const [count, setCount] = useState<number>()

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

    let countdownInterval: any = null
    const setCountdown = (countdown?: number) => {
      clearInterval(countdownInterval)
      setCount(countdown)

      if (!countdown) return

      countdownInterval = setInterval(() => {
        setCount((oldCount) => oldCount - 1)
        if (drawCountRef.current) drawCountRef.current -= 1
      }, 1000)
    }

    socket.on('setup', (data) => {
      const game = createGame({ map: maps[data.map] })
      data.state.tanks.forEach((tank) => {
        game.addTank(tank.id, tank.state.position)
      })
      game.setState(data.state)

      gameRef.current = game

      setCountdown(data.countdown)
      setGameData({ map: data.map, status: data.status })

      tankIdRef.current = data.id
    })

    socket.on('addTank', (data) => {
      gameRef.current.addTank(data.id, data.position)
    })

    socket.on('removeTank', (data) => {
      gameRef.current.removeTank(data.id)
    })

    socket.on('tankMoved', (data) => {
      const tank = gameRef.current.state.tanks.find(
        (tank) => tank.id === data.id
      )

      tank.setPosition(data.payload)
    })

    socket.on('tankRotated', (data) => {
      const tank = gameRef.current.state.tanks.find(
        (tank) => tank.id === data.id
      )

      tank.setPosition(data.payload)
    })

    socket.on('bulletAdded', (data) => {
      gameRef.current.addBullet(data)
    })

    socket.on('stateChanged', (data) => {
      gameRef.current.setState(data)

      const tank = data.tanks.find((tank) => tank.id === tankIdRef.current)

      if (tank) setHealth(tank.state.health)
    })

    socket.on('tankHealthChanged', (data) => {
      const tank = gameRef.current.state.tanks.find(
        (tank) => tank.id === data.id
      )

      tank.state.health = data.health
      if (data.id === tankIdRef.current) setHealth(data.health)
    })

    socket.on('statusChanged', (data) => {
      if (data.status === 'starting') drawCountRef.current = data.countdown
      else drawCountRef.current = undefined

      setCountdown(data.countdown)
      setGameData((oldGameData) => ({ ...oldGameData, status: data.status }))
    })

    socket.on('startGame', (data) => {
      gameRef.current.setState(data)
    })

    socket.on('gameEnded', (data) => {
      setGameData((oldGameData) => ({
        ...oldGameData,
        winnerId: data.winnerId
      }))
    })

    const keyboardListener = makeKeyboardListener()

    keyboardListener.subscribe((event) => {
      socket.emit(event.type, event.payload)
    })

    socket.emit('joinGame', id)

    return () => {
      socket.disconnect()
      keyboardListener.destroy()
      clearInterval(countdownInterval)
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
      const fillColor = tank.id === tankIdRef.current ? '#00A098' : '#A10000'
      tanksTypes.model1.forEach(({ x, y, width, height, color }) => {
        ctx.fillStyle = color || fillColor
        ctx.fillRect(x - initialX, y - initialY, width, height)
      })
      ctx.rotate(-rAngle)
      ctx.translate(
        -(tank.state.position.x + initialX),
        -(initialY + tank.state.position.y)
      )
    })

    if (drawCountRef.current) {
      const middleX = maps[gameData?.map].width / 2
      const middleY = maps[gameData?.map].height / 2

      ctx.clearRect(middleX - 100, middleY - 100, 200, 200)
      ctx.fillStyle = '#000000'
      ctx.textAlign = 'center'
      ctx.font = '50px "Press Start 2P"'
      ctx.fillText(drawCountRef.current.toString(), middleX, middleY)
    }
  }

  if (error) return <Error>{error}</Error>
  if (!gameData) return <Loading />
  if (gameData.winnerId)
    return (
      <EndGameContainer>
        <p>
          {gameData.winnerId === tankIdRef.current
            ? 'Weee, you won!'
            : 'Sorry, you lost!'}
        </p>
        <Button link="/">back</Button>
      </EndGameContainer>
    )

  return (
    <Container>
      <UpContainer>
        <Back />
        <InfoContainer>
          <span>status: {gameData.status}</span>
          {gameData.status !== 'waiting' && count && (
            <span>count: {count}</span>
          )}
        </InfoContainer>
      </UpContainer>
      <MapContainer>
        <Map drawFunction={drawGame} map={maps[gameData.map]} />
      </MapContainer>
      <HealthContainer>
        <HealthBar style={{ height: `${health}%` }} />
      </HealthContainer>
    </Container>
  )
}

export default PlayGame
