import { gql } from 'apollo-server'

export default gql`
  type Game {
    id: ID!
    map: String!
    players: [Player!]!
    winnerId: String
    duration: Int
  }

  extend type Query {
    getRunningGames: [Game!]!
    getSavedGames: [Game!]! @auth
  }

  extend type Mutation {
    createGame(map: String!): Game! @auth
  }
`
