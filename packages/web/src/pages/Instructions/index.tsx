import Title from '../../components/Title'
import {
  Content,
  ContentTitle,
  Key,
  Line,
  LargeKey,
  MoveKeyboard,
  MidText,
  Container
} from './styled'
import {
  ArrowSmDownIcon,
  ArrowSmUpIcon,
  ArrowSmLeftIcon,
  ArrowSmRightIcon
} from '@heroicons/react/solid'
import PageContainer from '../../components/PageContainer'

const Instructions = () => (
  <PageContainer>
    <Container>
      <Title>Instructions</Title>
      <Content>
        <ContentTitle>Move</ContentTitle>
        <Line>
          <MoveKeyboard>
            <Key>
              <ArrowSmUpIcon />
            </Key>
            <Line>
              <Key>
                <ArrowSmLeftIcon />
              </Key>
              <Key>
                <ArrowSmDownIcon />
              </Key>
              <Key>
                <ArrowSmRightIcon />
              </Key>
            </Line>
          </MoveKeyboard>
          <MidText>or</MidText>
          <MoveKeyboard>
            <Key>W</Key>
            <Line>
              <Key>A</Key>
              <Key>S</Key>
              <Key>D</Key>
            </Line>
          </MoveKeyboard>
        </Line>
      </Content>
      <Content>
        <ContentTitle>Fire</ContentTitle>
        <LargeKey>Space</LargeKey>
      </Content>
    </Container>
  </PageContainer>
)

export default Instructions
