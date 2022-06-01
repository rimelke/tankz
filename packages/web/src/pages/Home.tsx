import styled from 'styled-components'
import Menu from '../components/Menu'

const Container = styled.div`
  margin-top: 5rem;
`

const Home = () => (
  <Container>
    <Menu
      items={[
        { label: 'Play', url: '/play' },
        { label: 'Instructions', url: '/instructions' },
        { label: 'About', url: '/about' }
      ]}
    />
  </Container>
)

export default Home
