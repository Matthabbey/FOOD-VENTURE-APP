"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getSingleUser = exports.getAllUsers = exports.resendOTP = exports.Login = exports.verifyUser = exports.Register = void 0;
const utils_1 = require("../utils");
const userModel_1 = require("../models/userModel");
const uuid_1 = require("uuid");
const index_1 = require("../config/index");
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phone, password, address, confirm_password } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utils_1.registerSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //Generate Salt
        const salt = yield (0, utils_1.GenerateSalt)();
        const userPassword = yield (0, utils_1.GeneratePassword)(password, salt);
        //Generate OTP.
        const { otp, expiry } = (0, utils_1.GenerateOTP)();
        //Check if the user exist.
        const User = yield userModel_1.UserInstance.findOne({ where: { email: email } });
        if (!User) {
            const user = yield userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password: userPassword,
                firstName: "",
                lastName: "",
                salt,
                address: address,
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: false,
                role: "user",
            });
            //On resquesting OTP
            yield (0, utils_1.onRequestOTP)(otp, phone);
            //Send Email
            const html = (0, utils_1.emailHtml)(otp);
            yield (0, utils_1.mailSent)(index_1.FromAdminMail, email, index_1.userSubject, html);
            //Check if the user exist.
            const User = (yield userModel_1.UserInstance.findOne({
                where: { email: email },
            }));
            //Generate a signature
            const signature = yield (0, utils_1.GenerateSignature)({
                id: User.id,
                email: User.email,
                verified: User.verified,
            });
            console.log(signature);
            return res.status(201).json({
                messsage: "User successfully created",
                signature,
            });
        }
        return res.status(400).json({
            message: "User already exit",
        });
        //console.log(userPassword)
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/user/signup",
        });
        console.log(error);
    }
});
exports.Register = Register;
/**============================Verifying User to Login==============================**/
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.signature;
        const decode = yield (0, utils_1.verifySignature)(token);
        console.log(decode);
        //check if the user is a registered user
        const User = (yield userModel_1.UserInstance.findOne({
            where: { email: decode.email },
        })); //we are getting email from the awaiting of verifySignature
        //Getting the otp sent to the user by email or sms by requesting the validaty of the token
        if (User) {
            const { otp } = req.body;
            console.log(typeof User.otp);
            if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
                // User.verified == true
                // const updatedUser = await User.update()
                const updatedUser = (yield userModel_1.UserInstance.update({ verified: true }, { where: { email: decode.email } }));
                //Generate another signature for the validated or {updatedUser} verified account
                const signature = yield (0, utils_1.GenerateSignature)({
                    id: updatedUser.id,
                    email: updatedUser.email,
                    verified: updatedUser.verified,
                });
                if (updatedUser) {
                    const User = (yield userModel_1.UserInstance.findOne({
                        where: { email: decode.email },
                    }));
                    return res.status(200).json({
                        message: "Your account has been succesfully verified",
                        signature,
                        verified: User.verified,
                    });
                }
            }
        }
        return res.status(400).json({
            Error: "Invalid crediential or OTP is invalid",
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "users/verify",
        });
    }
});
exports.verifyUser = verifyUser;
/**==========================Login User ================================ */
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //Check if the user exist
        const User = (yield userModel_1.UserInstance.findOne({
            where: { email: email },
        }));
        if (User.verified === true) {
            const validation = yield (0, utils_1.validatePassword)(password, User.password, User.salt);
            //   const validation = await bcrypt.compare(password, User.password)
            if (validation) {
                const signature = yield (0, utils_1.GenerateSignature)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified,
                });
                return res.status(200).json({
                    message: "You have successfully logged in",
                    verified: User.verified,
                    email: User.email,
                    signature,
                });
            }
        }
        return res
            .status(400)
            .json({ message: "Wrong Username or password / not varified user" });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/user/signup",
        });
        console.log(error);
    }
});
exports.Login = Login;
/** ==========================Resend OTP ================================ */
const resendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.signature;
        const decode = yield (0, utils_1.verifySignature)(token);
        // console.log(decode)
        //check if the user is a registered user
        const User = (yield userModel_1.UserInstance.findOne({
            where: { email: decode.email },
        }));
        if (User) {
            const { otp, expiry } = (0, utils_1.GenerateOTP)();
            const updatedUser = (yield userModel_1.UserInstance.update({ otp, otp_expiry: expiry }, { where: { email: decode.email } }));
            if (updatedUser) {
                const User = (yield userModel_1.UserInstance.findOne({
                    where: { email: decode.email },
                }));
                //send otp to user
                yield (0, utils_1.onRequestOTP)(otp, User.phone);
                // send Mail to User
                const html = (0, utils_1.emailHtml)(otp);
                yield (0, utils_1.mailSent)(index_1.FromAdminMail, User.email, index_1.userSubject, html);
                return res.status(200).json({
                    message: "OTP has been resend to registered phone number and email",
                });
            }
        }
        return res.status(400).json({ Error: "Error sending OTP to User" });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "users/resend-otp/:signature",
        });
    }
});
exports.resendOTP = resendOTP;
/** ========================== PROFILE ================================ */
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
        const limit = req.query.limit; // as number | undefined
        const users = yield userModel_1.UserInstance.findAndCountAll({ limit: limit });
        return res.status(200).json({
            message: "You have successfully retrieved all users in your database",
            Count: users.count,
            User: users.rows,
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "users/get-all-users",
        });
    }
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.id;
        const User = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        return res.status(200).json({
            User,
        });
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "users/get-users",
        });
    }
});
exports.getSingleUser = getSingleUser;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.id;
        const { firstName, lastName, address, phone } = req.body;
        //Joi validation
        const validateResult = utils_1.updateSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //Check if the user is a registered user
        const User = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (!User) {
            return res.status(400).json({
                Error: "You are not authorized to update your profile",
            });
        }
        const updatedUser = (yield userModel_1.UserInstance.update({ firstName, lastName, address, phone }, { where: { id: id } }));
        if (updatedUser) {
            const User = (yield userModel_1.UserInstance.findOne({
                where: { id: id },
            }));
            return res.status(200).json({
                message: "You have successfully updated your profile",
            });
        }
        return res.status(400).json({
            Error: "An error occurs",
        });
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "users/update-user-profile",
        });
    }
});
exports.updateUserProfile = updateUserProfile;
