import PageContainer from '../../../components/PageContainer'
import * as maps from '@tankz/game/maps'
import Map from '../../../components/Map'
import { Content, MapContainer, MapList } from './styled'
import { useMutation } from '@apollo/client'
import { CREATE_GAME } from '../../../constants/queries'
import Loading from '../../../components/Loading'
import { useNavigate } from 'react-router-dom'

const PlayCreate = () => {
  const [createGame, { loading }] = useMutation(CREATE_GAME)
  const navigate = useNavigate()

  const handleSubmit = (map: string) => {
    createGame({ variables: { map } }).then(({ data }) => {
      navigate(`/play/${data.createGame.id}`)
    })
  }

  if (loading) return <Loading />

  return (
    <PageContainer title="Create a game">
      <Content>
        <h3>Select a map</h3>
        <MapList>
          {Object.entries(maps).map(([key, map]) => (
            <MapContainer onClick={() => handleSubmit(key)} key={key}>
              <Map map={map} />
            </MapContainer>
          ))}
        </MapList>
      </Content>
    </PageContainer>
  )
}

export default PlayCreate
