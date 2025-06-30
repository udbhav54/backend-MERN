import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"; // 1st
import { User } from "../models/user.model.js"; // 2nd
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // 5th
import { ApiResponse } from "../utils/ApiResponse.js"; // 9th
import jwt from "jsonwebtoken";

// method -> access and refresh token
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // save tokens in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken }; // generate token
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  /*
    1. get user details from frontend (go model -> user.model.js)
    2. validation -> not empty
    3. check if user already exists: username, email
    4. check for images, check for avatar
    5. upload them to cloudinary, avatar check
    6. create user object - create entry in db
    7. remove password and refresh token field from response
    8. check for user creation
    9. return response
  */
  // 1st step
  const { fullName, email, username, password } = req.body;
  // console.log("email: ", email);

  // if (fullName === "") {
  //   throw new ApiError(400, "fullname is required")
  // }
  // 2nd
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // 3rd
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // console.log(req.files);

  //4th -> multer gives files assess in this way
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  // console.log(avatarLocalPath);

  // classic way to validate coveImage

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // 5th
  // upload on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  //6th -> how we make entry in database, create user
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  await user.save();
  //7th
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // 8th
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  // 9th
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // 1. req body -> data
  // 2. username or email
  // 3. find the user
  // 4. password check
  // 5. access and refresh token
  // 6. send cookie

  // 1st and 2nd steps
  // how to take data from body
  const { email, username, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  // 3rd step
  // how to find user is existed or not based on username | email
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log("Found user", user);

  // if user not existed then throw ApiError
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // 4th step
  // how to check password
  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log("Password match", isPasswordValid);

  // error
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // 5th step
  // access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id)
    // if u don't want
    .select("-password -refreshToken");

  // send to cookie (6th step)
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

 try {
   const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
 
   const user = await User.findById(decodedToken?._id)
 
   if (!user) {
     throw new ApiError(401, "Invalid refresh token");
   }
 
   if(incomingRefreshToken !== user?.refreshToken) {
     throw new ApiError(401, "Refresh token is expired or used");
   }
 
   const options = {
     httpOnly: true,
     secure: true
   }
   const {accessToken, newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
 
   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", newrefreshToken, options)
   .json(
     new ApiResponse(
       200,
       {
         accessToken, refreshToken: newrefreshToken
       },
       "Access token refreshed"
     )
   )
 } catch (error) {
    throw new ApiError(401, error?.message || "Invaid refresh token" )
  
 }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
