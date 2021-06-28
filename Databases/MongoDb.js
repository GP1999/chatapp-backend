const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri =process.env.MONGO_URI;
const mongodb = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
    try {
      // Connect the client to the server
      await mongodb.connect();
      
      // Establish and verify connection
      await mongodb.db("admin").command({ ping: 1 });
      console.log("Connected successfully to MongoDB");
    }catch(err){
        console.log(err);

    }
  }
   run().catch(console.dir);
  module.exports=mongodb;
