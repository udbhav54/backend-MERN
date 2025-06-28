import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model"

export const verifyJWT = asyncHandler(async(req, _, next) => {
  try {
    const token = req.cookies?.assessToken || req.header("Authorization") ?.replace("Bearer ", "")
  
    if(!token) {
      throw new ApiError(401, "Unauthorized request")
    }
  
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRIT);
  
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    if(!user) {
      throw new ApiError(401, "Invalid Access Token")
    }
  
    req.user= user;
    next()
  } catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token")
  }
})

/*
  // Import the asyncHandler wrapper that lets us write async route‑handlers
// without having to write try/catch around every await.
import { asyncHandler } from "../utils/asyncHandler"

// Import our custom error class so we can throw typed HTTP errors.
import { ApiError } from "../utils/ApiError"

// Import the jsonwebtoken library to decode / verify JWTs.
import jwt from "jsonwebtoken"

// Import the User model to look up the user in MongoDB.
import { User } from "../models/user.model"


// ──────────────────────────────────────────────────────────────
// verifyJWT middleware: checks that the request includes a valid
// access‑token cookie or Bearer header and attaches the user object.
// It’s wrapped in asyncHandler so any error is automatically
// forwarded to the global Express error handler.
// ──────────────────────────────────────────────────────────────
export const verifyJWT = asyncHandler(async (req, res, next) => {

  try {
    // 1. Read the token:
    //    • Prefer the signed cookie named "assessToken" (likely a typo for "accessToken").
    //    • Fallback to an Authorization header in the form "Bearer <token>".
    const token =
      req.cookies?.assessToken ||                     // cookie‑based auth
      req.header("Authorization")                     // header‑based auth
        ?.replace("Bearer ", "")                      // strip the prefix
    // ----------------------------------------------------------

    // 2. If no token is found, reject the request.
    if (!token) {
      throw new ApiError(401, "Unauthorized request")
    }
    // ----------------------------------------------------------

    // 3. Verify and decode the token using the secret from env vars.
    //    jwt.verify throws if the token is expired or invalid.
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRIT                 // (note: typo: SECRET)
    )
    // ----------------------------------------------------------

    // 4. Look up the user referenced by the token payload’s _id.
    //    • .select("-password -refreshToken") removes sensitive fields.
    const user = await User.findById(decodedToken?._id)
      .select("-password -refreshToken")

    // 5. If the user no longer exists (or was soft‑deleted), reject.
    if (!user) {
      throw new ApiError(401, "Invalid Access Token")
    }
    // ----------------------------------------------------------

    // 6. Attach the user object to req so downstream handlers
    //    can read req.user without hitting the DB again.
    req.user = user

    // 7. Allow the request to proceed to the next middleware / route.
    next()

  } catch (error) {
    // 8. Any error (missing token, bad token, DB failure, etc.)
    //    is re‑thrown as a 401 ApiError with a helpful message.
    throw new ApiError(401, error?.message || "Invalid access token")
  }
})



*/
