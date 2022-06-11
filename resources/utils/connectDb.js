import mongoose from "mongoose";

export const connect = (url = process.env.MONGODB_CONNECTION_STRING) => {
    return mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  };  