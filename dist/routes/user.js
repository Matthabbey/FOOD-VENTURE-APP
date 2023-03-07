"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const useController_1 = require("../controller/useController");
const authorization_1 = require("../middlewares/authorization");
const router = express_1.default.Router();
router.post("/signup", useController_1.Register);
router.post("/verify/:signature", useController_1.verifyUser); //: means the query params, to get the id of the user saved in the local storage
router.post("/login", useController_1.Login);
router.get("/resend-otp/:signature", useController_1.resendOTP);
router.get("/get-all-users", useController_1.getAllUsers);
router.get("/get-user", authorization_1.auth, useController_1.getSingleUser);
router.patch("/update-profile", authorization_1.auth, useController_1.updateUserProfile);
exports.default = router;
