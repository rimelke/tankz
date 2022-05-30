import { gql } from 'apollo-server'

export default gql`
  type Player {
    id: ID!
    nickname: String!
  }

  type LoginReturn {
    token: String!
  }

  extend type Mutation {
    createPlayer(nickname: String!, password: String!): Player!
    loginPlayer(nickname: String!, password: String!): LoginReturn!
  }
`
