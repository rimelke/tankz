import { CustomLink, MenuContainer, MenuItem } from './styled'

interface IMenuProps {
  items: {
    label: string
    url: string
  }[]
}

const Menu = ({ items }: IMenuProps) => (
  <MenuContainer>
    {items.map(({ label, url }) => (
      <MenuItem key={label}>
        <CustomLink to={url}>{label}</CustomLink>
      </MenuItem>
    ))}
  </MenuContainer>
)

export default Menu
