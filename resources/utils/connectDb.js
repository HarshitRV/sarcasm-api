import mongoose from "mongoose";
import { SECRETS } from "../configs/config.js";

export const connect = (url = SECRETS.MONGODB_CONNECTION_STRING) => {
    return mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  };  