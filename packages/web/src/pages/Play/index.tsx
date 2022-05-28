import Menu from '../../components/Menu'
import PageContainer from '../../components/PageContainer'

const Play = () => {
  return (
    <PageContainer title="Play">
      <Menu
        items={[
          { label: 'Create', url: '/play/create' },
          { label: 'Find', url: '/play/find' },
          { label: 'Join', url: '/play/join' }
        ]}
      />
    </PageContainer>
  )
}

export default Play
