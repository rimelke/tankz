import {
  Content,
  ContentTitle,
  Key,
  Line,
  LargeKey,
  MoveKeyboard,
  MidText,
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
import createTank from '@tankz/game/factories/createTank'
import { TANK_SIZE } from '@tankz/game/constants'
import * as tankTypes from '../../constants/tanks'
import createBullet, { IBullet } from '@tankz/game/factories/createBullet'
import makeCheckLimitsCollision from '@tankz/game/factories/makeCheckLimitsCollision'
import makeKeyboardListener from '../../factories/makeKeyboardListener'

const Instructions = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    canvasRef.current.width = window.innerWidth
    canvasRef.current.height = window.innerHeight

    const ctx = canvasRef.current.getContext('2d')

    if (!ctx) return

    const bullets: IBullet[] = []

    const checkLimitsCollision = makeCheckLimitsCollision(
      window.innerWidth,
      window.innerHeight
    )
    const tank = createTank({
      id: 'tank',
      addBullet: (position) => {
        const bullet = createBullet({
          defaultPos: position,
          checkCollision: (position) => checkLimitsCollision([position])
        })

        bullets.push(bullet)
      },
      checkCollision: () => false,
      defaultPosition: { x: 200, y: window.innerHeight / 2, direction: 90 }
    })

    let animationCode: number

    const initialX = TANK_SIZE.width / 2
    const initialY = TANK_SIZE.height / 2

    const render = () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      ctx.fillStyle = '#555555'

      bullets.forEach((bullet) => {
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
        ctx.fillStyle = color || '#00A098'
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

    const interval = setInterval(() => {
      bullets.forEach(
        (bullet, index) => !bullet.moveBullet() && bullets.splice(index, 1)
      )
    }, 10)

    const keyboardListener = makeKeyboardListener()

    keyboardListener.subscribe((event) => {
      tank.makeAction(event.payload)
    })

    return () => {
      clearInterval(interval)
      cancelAnimationFrame(animationCode)
      keyboardListener.destroy()
    }
  }, [])

  return (
    <PageContainer title="Instructions">
      <BackgroundCanvas ref={canvasRef} />
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
    </PageContainer>
  )
}
export default Instructions
