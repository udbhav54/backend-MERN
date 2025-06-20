//  require("dotenv").config({path: './env'});
import dotenv from "dotenv";
import connectDB from "./db/index.js";
//  import mongoose from "mongoose";
//  import { DB_NAME } from "./constants";

dotenv.config({
  path: "./env",
});

connectDB();

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
