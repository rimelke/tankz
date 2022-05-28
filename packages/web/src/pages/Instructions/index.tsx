import Title from '../../components/Title'
import {
  Content,
  ContentTitle,
  Key,
  Line,
  LargeKey,
  MoveKeyboard,
  MidText,
  Container,
  BackgroundCanvas
} from './styled'
import {
  ArrowSmDownIcon,
  ArrowSmUpIcon,
  ArrowSmLeftIcon,
  ArrowSmRightIcon
} from '@heroicons/react/solid'
import PageContainer from '../../components/PageContainer'
import { useEffect, useRef } from 'react'
import {
  IContinuosAction,
  ISingleAction
} from '@tankz/game/factories/createTank'
import createGame from '@tankz/game'
import { TANK_SIZE } from '@tankz/game/constants'
import * as tankTypes from '../../constants/tanks'

// import { TANK_SIZE } from '@tankz/game/constants'
// import tankTypes from '@tankz/game/tankTypes'

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

const Instructions = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    canvasRef.current.width = window.innerWidth / 1.5
    canvasRef.current.height = window.innerHeight / 1.5

    const ctx = canvasRef.current.getContext('2d')

    if (!ctx) return

    const game = createGame({})
    const tank = game.addTank()

    let animationCode: number

    const initialX = TANK_SIZE.width / 2
    const initialY = TANK_SIZE.height / 2

    const render = () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

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

      const rAngle = (Math.PI * tank.state.position.direction) / 180

      ctx.translate(
        tank.state.position.x + initialX,
        tank.state.position.y + initialY
      )
      ctx.rotate(rAngle)
      tankTypes.model1.forEach(({ x, y, width, height, color }) => {
        ctx.fillStyle = color
        ctx.fillRect(x - initialX, y - initialY, width, height)
      })
      ctx.rotate(-rAngle)
      ctx.translate(
        -(tank.state.position.x + initialX),
        -(initialY + tank.state.position.y)
      )

      animationCode = requestAnimationFrame(render)
    }

    render()

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
  }, [])

  return (
    <PageContainer>
      <BackgroundCanvas ref={canvasRef} />
      <Container>
        <Title>Instructions</Title>
        <Content>
          <ContentTitle>Move</ContentTitle>
          <Line>
            <MoveKeyboard>
              <Key>
                <ArrowSmUpIcon />
              </Key>
              <Line>
                <Key>
                  <ArrowSmLeftIcon />
                </Key>
                <Key>
                  <ArrowSmDownIcon />
                </Key>
                <Key>
                  <ArrowSmRightIcon />
                </Key>
              </Line>
            </MoveKeyboard>
            <MidText>or</MidText>
            <MoveKeyboard>
              <Key>W</Key>
              <Line>
                <Key>A</Key>
                <Key>S</Key>
                <Key>D</Key>
              </Line>
            </MoveKeyboard>
          </Line>
        </Content>
        <Content>
          <ContentTitle>Fire</ContentTitle>
          <LargeKey>Space</LargeKey>
        </Content>
      </Container>
    </PageContainer>
  )
}
export default Instructions
