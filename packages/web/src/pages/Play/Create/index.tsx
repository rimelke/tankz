import PageContainer from '../../../components/PageContainer'
import * as maps from '@tankz/game/maps'
import Map from '../../../components/Map'
import { Content, MapContainer, MapList } from './styled'

const PlayCreate = () => {
  return (
    <PageContainer title="Create a game">
      <Content>
        <h3>Select a map</h3>
        <MapList>
          {Object.entries(maps).map(([key, map]) => (
            <MapContainer key={key}>
              <Map map={map} />
            </MapContainer>
          ))}
        </MapList>
      </Content>
    </PageContainer>
  )
}

export default PlayCreate
