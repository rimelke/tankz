import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 7rem;
`

const Text = styled.span`
  font-size: 1.1rem;
`

const Loading = () => (
  <Container>
    <Text>Loading...</Text>
  </Container>
)

export default Loading
