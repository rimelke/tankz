import styled from 'styled-components'
import Logout from '../components/Logout'
import Menu from '../components/Menu'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 2rem;
`

const Content = styled.div`
  margin-top: 5rem;
`

const Home = () => (
  <Container>
    <Content>
      <Menu
        items={[
          { label: 'Play', url: '/play' },
          { label: 'History', url: '/history' },
          { label: 'Instructions', url: '/instructions' }
        ]}
      />
    </Content>
    <Logout />
  </Container>
)

export default Home
