import createGame, { IGame } from '@tankz/game'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

const PlayGame = () => {
  const { id } = useParams()

  useEffect(() => {
    if (!id) return

    let game: IGame

    const socket = io('ws://localhost:4000', {
      auth: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOTYyNTA3NzEwMDI4YzZkZmEzNWFmNiIsImlhdCI6MTY1NDAxMTEwMywiZXhwIjoxNjU0NjE1OTAzfQ.8U6TICBsm89-JlTjlCLviEWZu8muN_VQ290rK82x0q0'
      }
    })

    socket.on('setup', (data) => {
      console.log('setup', data)

      game = createGame({ map: data.map })
      game.setState(data.state)
    })

    socket.emit('joinGame', id)
  }, [])

  return (
    <div>
      <h1>Play Game</h1>
    </div>
  )
}

export default PlayGame
