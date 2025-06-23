import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // if u want to enable searching field then make index true of that field
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true, // it is used to remove space after and before string like this " Udbhav " -> "Udbhav"
    },
    fullName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video",
    }
  ],
    password: {
      type: String,
      required: [true, "Password is required"],
      unique: true,
      lowercase: true,
    },
    refreshToken: {
      type: String
    }
  },
  { timestamps: true }
);

// here we use pre() hook if u want to execute something before data save
userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next(); // here we are checking password is modify or not ?

  // this will run when password is modified and it will hash the password (it take 2 parameter 1-> password 2-> round)

  this.password = bcrypt.hash(this.password, 10)
  next()
})

// custom method
// here we create custom method which check password is correct or not ? it will compare with store password and password enter by user
userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRIT,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  ); 
}
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRIT,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
}
export const User = mongoose.model("User", userSchema);
