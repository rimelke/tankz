import Menu from '../components/Menu'

const Home = () => (
  <Menu
    items={[
      { label: 'Play', url: '/play' },
      { label: 'Instructions', url: '/instructions' },
      { label: 'About', url: '/about' }
    ]}
  />
)

export default Home
