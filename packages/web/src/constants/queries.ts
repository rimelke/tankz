import { gql } from '@apollo/client'

export const LOGIN_PLAYER = gql`
  mutation LoginPlayer($nickname: String!, $password: String!) {
    loginPlayer(nickname: $nickname, password: $password) {
      token
      player {
        nickname
      }
    }
  }
`

export const CREATE_PLAYER = gql`
  mutation CreatePlayer($nickname: String!, $password: String!) {
    createPlayer(nickname: $nickname, password: $password) {
      id
    }
  }
`

export const CREATE_GAME = gql`
  mutation CreateGame($map: String!) {
    createGame(map: $map) {
      id
    }
  }
`

export const GET_RUNNING_GAMES = gql`
  query GetRunningGames {
    getRunningGames {
      id
      map
      players {
        id
        nickname
      }
    }
  }
`
