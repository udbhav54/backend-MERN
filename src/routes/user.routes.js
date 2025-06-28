import { Router } from "express";
import { logoutUser, loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js"
import { verifyJWT  } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(
  upload.fields([ // here we are using middleware
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "coverImage",
      maxCount: 1
    }
  ]),
  registerUser)

router.route("/login").post(loginUser)

// secured routes
router.route('/logout').post(verifyJWT, logoutUser)

export default router