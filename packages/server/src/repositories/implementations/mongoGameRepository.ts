import mongodb from '@infra/mongodb'
import GameRepository from '@repositories/GameRepository'
import { ObjectId } from 'mongodb'

const makeMongoGameRepository = (): GameRepository => {
  const gameCollection = mongodb.getCollection('games')

  const mongoGameRepository: GameRepository = {
    async create(data) {
      const { insertedId } = await gameCollection.insertOne({
        ...data,
        players: data.players.map((player) => new ObjectId(player.id))
      })

      return { ...data, id: insertedId.toString() }
    }
  }

  return mongoGameRepository
}

export default makeMongoGameRepository
