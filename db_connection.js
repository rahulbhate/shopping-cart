const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
//mongodb://admin:<password>@cluster0-shard-00-00-pbkmp.mongodb.net:27017,cluster0-shard-00-01-pbkmp.mongodb.net:27017,cluster0-shard-00-02-pbkmp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-pbkmp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true  },
  )
  .then((result) => {
    console.log('Connection Successful');
  })
  .catch((err) => {
    console.log(err, 'Bad Request Connnection...*****************');
  });