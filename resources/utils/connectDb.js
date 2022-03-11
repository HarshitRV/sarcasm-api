import mongoose from "mongoose";
import { SECRETS } from "../configs/config.js";

export const connect = (url = SECRETS.MOGODB_LOCAL_CONNECTION) => {
    return mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  };  