import { gql } from 'apollo-server'

export default gql`
  type Game {
    id: ID!
    map: String!
    players: [Player!]!
  }

  extend type Mutation {
    createGame(map: String!): Game! @auth
  }
`
