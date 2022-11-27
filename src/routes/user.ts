import express from "express";
import {
  Register,
  verifyUser,
  Login,
  resendOTP,
  getAllUsers,
  getSingleUser,
  updateUserProfile,
} from "../controller/useController";
import { auth } from "../middlewares/authorization";

const router = express.Router();

router.post("/signup", Register);
router.post("/verify/:signature", verifyUser); //: means the query params, to get the id of the user saved in the local storage
router.post("/login", Login);
router.get("/resend-otp/:signature", resendOTP);
router.get("/get-all-users", getAllUsers);
router.get("/get-user", auth, getSingleUser);
router.patch("/update-profile", auth, updateUserProfile);

export default router;
