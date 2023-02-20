const { MongoClient } = require('mongodb');

const dbUri = process.env.DB_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;

module.exports = {
  connectToServer: async () => {
    try {
      await client.connect();
      _db = client.db(dbName);
      console.log('Successfully connected to MongoDB.');
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  },

  appDb: () => {
    return _db;
  },
};
