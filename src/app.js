import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// here we allow request which we want (before we need to download module like cors, cookie-parser)
// Enable CORS for specified origin and allow credentials like cookies to be sent.
// Make sure `process.env.CORS_ORIGIN` is defined in your environment variables.
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// here we put the restristion on incoming json data
app.use(express.json({ limit: "16kb" }));

// here we see url encoder which help in decoding the data which come from URL like + %..
// here we "extended" for nested object
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// if we want to store some file like (pdf, images) which we want on my server and assess by any one for that we need to create "public" folder
app.use(express.static("public"));

// if we want to assess the user server cookie then we do this
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
// http://localhost:8000/api/v1/users/login

export { app };
