import mongodb from '@infra/mongodb'
import GameRepository from '@repositories/GameRepository'
import { ObjectId } from 'mongodb'

const makeMongoGameRepository = () => {
  const gameCollection = mongodb.getCollection('games')

  const mongoGameRepository: GameRepository = {
    async save(data) {
      const { insertedId } = await gameCollection.insertOne({
        ...data,
        players: data.players.map((player) => new ObjectId(player.id)),
        winnerId: data.winnerId ? new ObjectId(data.winnerId) : null
      })

      return { ...data, id: insertedId.toString() }
    },
    async findByPlayerId(playerId) {
      const games = await gameCollection
        .aggregate([
          {
            $match: {
              players: {
                $elemMatch: {
                  $eq: new ObjectId(playerId)
                }
              }
            }
          },
          {
            $sort: {
              _id: -1
            }
          },
          {
            $lookup: {
              from: 'players',
              localField: 'players',
              foreignField: '_id',
              as: 'players'
            }
          }
        ])
        .toArray()

      return games.map((game) => ({
        id: game._id.toString(),
        map: game.map,
        players: game.players.map((player) => ({
          id: player._id.toString(),
          nickname: player.nickname
        })),
        winnerId: game.winnerId ? game.winnerId.toString() : null,
        duration: game.duration
      }))
    }
  }

  return mongoGameRepository
}

export default makeMongoGameRepository
