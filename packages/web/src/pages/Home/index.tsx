import { CustomLink, MenuContainer, MenuItem } from './styled'

const Home = () => (
  <MenuContainer>
    <MenuItem>
      <CustomLink to="/">Play</CustomLink>
    </MenuItem>
    <MenuItem>
      <CustomLink to="/instructions">Instructions</CustomLink>
    </MenuItem>
    <MenuItem>
      <CustomLink to="/about">About</CustomLink>
    </MenuItem>
  </MenuContainer>
)

export default Home
