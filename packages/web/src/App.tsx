// import { useEffect, useRef } from 'react'
// import createGame from '@tankz/game'
// import { TANK_SIZE } from '@tankz/game/constants'
// import tanksTypes from '@tankz/game/tankTypes'
// import { IContinuosAction, ISingleAction } from '@tankz/game/createTank'

import './styles/global.css'
import Routes from './routes'
import Logo from './components/Logo'
import { Container, MainContent } from './styled'

// const continuosKeys: Record<string, IContinuosAction> = {
//   ArrowUp: 'MoveForward',
//   ArrowDown: 'MoveBackward',
//   ArrowLeft: 'TurnLeft',
//   ArrowRight: 'TurnRight',
//   w: 'MoveForward',
//   s: 'MoveBackward',
//   a: 'TurnLeft',
//   d: 'TurnRight'
// }

// const singleKeys: Record<string, ISingleAction> = {
//   Space: 'Fire'
// }

// const App = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null)

//   useEffect(() => {
//     if (!canvasRef.current) return

//     const ctx = canvasRef.current.getContext('2d')

//     if (!ctx) return

//     let animationCode: number

//     const game = createGame()
//     const tank1 = game.addTank('tank1')
//     game.addTank('tank2')

//     const render = (ctx: CanvasRenderingContext2D) => {
//       ctx.clearRect(0, 0, 800, 500)

//       ctx.fillStyle = '#555555'

//       game.bullets.forEach(({ pos }) => {
//         ctx.beginPath()
//         ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2)
//         ctx.fill()
//       })

//       game.map.forEach(({ x, y, width, height, health }) => {
//         ctx.fillStyle = `rgba(0, 0, 0, ${
//           health ? Math.ceil(health / 10) / 10 : 1
//         })`
//         ctx.fillRect(x, y, width, height)
//       })

//       game.tanks.forEach((tank) => {
//         const initialX = TANK_SIZE.width / 2
//         const initialY = TANK_SIZE.height / 2
//         const rAngle = (Math.PI * tank.state.direction) / 180

//         ctx.translate(tank.state.pos.x + initialX, tank.state.pos.y + initialY)
//         ctx.rotate(rAngle)
//         tanksTypes[tank.type].forEach(({ x, y, width, height, color }) => {
//           ctx.fillStyle = color
//           ctx.fillRect(x - initialX, y - initialY, width, height)
//         })
//         ctx.rotate(-rAngle)
//         ctx.translate(
//           -(tank.state.pos.x + initialX),
//           -(initialY + tank.state.pos.y)
//         )
//       })

//       animationCode = requestAnimationFrame(() => render(ctx))
//     }

//     render(ctx)

//     document.onkeydown = (e) => {
//       if (continuosKeys[e.key]) tank1.startAction(continuosKeys[e.key])
//     }

//     document.onkeyup = (e) => {
//       if (continuosKeys[e.key]) tank1.stopAction(continuosKeys[e.key])

//       if (singleKeys[e.code]) tank1.singleAction(singleKeys[e.code])
//     }

//     return () => {
//       cancelAnimationFrame(animationCode)
//       document.onkeydown = null
//       document.onkeyup = null
//     }
//   }, [])

//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center'
//       }}>
//       <h1>TankZ</h1>
//       <canvas
//         ref={canvasRef}
//         width={800}
//         height={500}
//         style={{ border: '10px solid #777' }}
//       />
//     </div>
//   )
// }

const App = () => (
  <Container>
    <Logo />
    <MainContent>
      <Routes />
    </MainContent>
  </Container>
)

export default App
