import './styles/global.css'
import Routes from './routes'
import Logo from './components/Logo'
import { Container, MainContent } from './styled'
import {
  ApolloProvider,
  InMemoryCache,
  ApolloClient,
  createHttpLink
} from '@apollo/client'
import { AuthProvider, getAuthorization } from './contexts/AuthContext'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:4000/graphql'
})

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: getAuthorization()
  }
}))

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})

const App = () => (
  <ApolloProvider client={client}>
    <Container>
      <Logo />
      <MainContent>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </MainContent>
    </Container>
  </ApolloProvider>
)

export default App
