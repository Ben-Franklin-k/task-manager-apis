const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGO_DB_URL,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,useFindAndModify:false },
  (err, res) => {
    if (err) {
      return console.error("Unable to connect");
    }
    console.log("connected successfully");
  }
);

