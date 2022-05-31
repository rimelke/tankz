import { gql } from '@apollo/client'

export const CREATE_GAME = gql`
  mutation CreateGame($map: String!) {
    createGame(map: $map) {
      id
    }
  }
`
