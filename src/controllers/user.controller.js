import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js" // 1st
import { User } from "../models/user.model.js" // 2nd
import { uploadOnCloudinary } from "../utils/cloudinary.js" // 5th
import { ApiResponse } from "../utils/ApiResponse.js"; // 9th

const registerUser = asyncHandler( async (req, res) => {
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
    const {fullName, email, username, password} = req.body
    console.log("email: ", email);
    

    // if (fullName === "") {
    //   throw new ApiError(400, "fullname is required") 
    // }
    // 2nd
    if (
      [fullName, email, username, password].some((field)=>
        field?.trim() ==="")
    ) {
      throw new ApiError(400, "All fields are required")
    }

    // 3rd
    const existedUser = User.findOne({
      $or: [{username}, {email}]
    })
    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists")
    }

    //4th -> multer gives files assess in this way
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.fiels?.coverImage[0]?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required")
    }

    // 5th
    // upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
      throw new ApiError(400, "Avatar file is required")
    }

    //6th -> how we make entry in database, create user
   const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLoweCase()
    })
    //7th
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    // 8th
    if(!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user")
    }
    // 9th
    return res.satatus(201).json(
      new ApiResponse(200, createdUser, "User registered Successfully")
    )
} )

export {registerUser}