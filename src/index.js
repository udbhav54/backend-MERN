//  require("dotenv").config({path: './env'});
import dotenv from "dotenv";
import connectDB from "./db/index.js";

import { app } from "./app.js";
//  import mongoose from "mongoose";
//  import { DB_NAME } from "./constants";

dotenv.config({
  path: "./.env",
});

connectDB()
.then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running at port : ${process.env.PORT}`);
  })
})
.catch((err) => {
  console.log(`MONGO db connection failed !!! ${err}`);
})

/*
 import express from "express"
 const app = express()
// IIFE (Immediately Invoked Function Expression) // way to connect database (1st approach)
;(async () => {
  try {
    await mongoose.connect(`${process.env.MONGOBD_URI}/${DB_NAME}`);
    app.on("error", (error)=> {
      console.log("ERROR", error); // if error related to express
      throw error
    })

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    } )

  } catch (error) {
    console.log("ERROR", error);
    throw err
  }
})()
  */

// 1st way
//  function connectDB(){}

//  connectDB()
