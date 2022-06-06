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
    }
  }

  return mongoGameRepository
}

export default makeMongoGameRepository
