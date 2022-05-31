import { MongoClient } from 'mongodb'

const mongodb = {
  client: new MongoClient(process.env.MONGO_URL),

  connect() {
    return mongodb.client.connect()
  },

  getCollection(name: string) {
    return mongodb.client.db().collection(name)
  }
}

export default mongodb
