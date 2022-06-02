// import { useEffect, useRef } from 'react'
// import createGame from '@tankz/game'
// import { TANK_SIZE } from '@tankz/game/constants'
// import tanksTypes from '@tankz/game/tankTypes'
// import { IContinuosAction, ISingleAction } from '@tankz/game/createTank'

import './styles/global.css'
import Routes from './routes'
import Logo from './components/Logo'
import { Container, MainContent } from './styled'
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOTYyNTA3NzEwMDI4YzZkZmEzNWFmNiIsImlhdCI6MTY1NDAxMTEwMywiZXhwIjoxNjU0NjE1OTAzfQ.8U6TICBsm89-JlTjlCLviEWZu8muN_VQ290rK82x0q0'
  }
})

const App = () => (
  <ApolloProvider client={client}>
    <Container>
      <Logo />
      <MainContent>
        <Routes />
      </MainContent>
    </Container>
  </ApolloProvider>
)

export default App
