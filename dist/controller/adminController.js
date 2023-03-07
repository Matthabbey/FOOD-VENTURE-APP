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
exports.createVendor = exports.SuperAdmin = exports.AdminRegister = void 0;
const utils_1 = require("../utils");
const userModel_1 = require("../models/userModel");
const uuid_1 = require("uuid");
const vendorModel_1 = require("../models/vendorModel");
const AdminRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.id;
        const { email, phone, password, address, lastName, firstName } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utils_1.adminSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //Generate Salt
        const salt = yield (0, utils_1.GenerateSalt)();
        const AdminPassword = yield (0, utils_1.GeneratePassword)(password, salt);
        //Generate OTP.
        const { otp, expiry } = (0, utils_1.GenerateOTP)();
        //Check if the user exist.
        const Admin = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (Admin.email === email) {
            return res.status(400).json({
                message: "Email Already Exit",
            });
        }
        if (Admin.phone === phone) {
            return res.status(400).json({
                message: "Phone Already exist",
            });
        }
        //Create Admin
        if (Admin.role === "superAdmin") {
            const user = yield userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password: AdminPassword,
                firstName,
                lastName,
                salt,
                address,
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: true,
                role: "admin",
            });
            //On resquesting OTP
            //   await onRequestOTP(otp, phone);
            //   //Send Email
            //   const html = emailHtml(otp);
            //   await mailSent(FromAdminMail, email, userSubject, html);
            //Check if the user exist.
            const Admin = (yield userModel_1.UserInstance.findOne({
                where: { id: id },
            }));
            //Generate a signature
            const signature = yield (0, utils_1.GenerateSignature)({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified,
            });
            return res.status(201).json({
                messsage: "Admin successfully created",
                signature,
            });
        }
        return res.status(400).json({
            message: "Admin already exit",
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admin/signup",
        });
    }
});
exports.AdminRegister = AdminRegister;
/** ================= Super Admin ===================== **/
const SuperAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phone, password, firstName, lastName, address } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utils_1.adminSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // Generate salt
        const salt = yield (0, utils_1.GenerateSalt)();
        const adminPassword = yield (0, utils_1.GeneratePassword)(password, salt);
        // Generate OTP
        const { otp, expiry } = (0, utils_1.GenerateOTP)();
        // check if the admin exist
        const Admin = (yield userModel_1.UserInstance.findOne({
            where: { email: email },
        }));
        //Create Admin
        if (!Admin) {
            yield userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password: adminPassword,
                firstName,
                lastName,
                salt,
                address,
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: true,
                role: "superadmin",
            });
            // check if the admin exist
            const Admin = (yield userModel_1.UserInstance.findOne({
                where: { email: email },
            }));
            //Generate signature for user
            let signature = yield (0, utils_1.GenerateSignature)({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified,
            });
            return res.status(201).json({
                message: "Admin created successfully",
                signature,
                verified: Admin.verified,
            });
        }
        return res.status(400).json({
            message: "Admin already exist",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/create-admin",
        });
    }
});
exports.SuperAdmin = SuperAdmin;
/**-============================== Create Vendor ============================ */
const createVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.id;
        // console.log(id)
        const { name, restaurantName, pincode, phone, address, email, password } = req.body;
        const validateResult = utils_1.vendorSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // const {email, password, name, ownerName, pincode, address, phone} = req.body
        const salt = yield (0, utils_1.GenerateSalt)();
        const vendorPassword = yield (0, utils_1.GeneratePassword)(password, salt);
        const uuidVendor = (0, uuid_1.v4)();
        //Generate OTP.
        const { otp, expiry } = (0, utils_1.GenerateOTP)();
        //Check if the user exist.
        const Vendor = (yield vendorModel_1.VendorInstance.findOne({
            where: { email: email },
        }));
        // if (Vendor.email === email) {
        //   return res.status(400).json({
        //     message: "Email Already",
        //   });
        // }
        const Admin = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        console.log("I am here now");
        if (Admin.role === "admin" || Admin.role === "superadmin") {
            if (!Vendor) {
                const createVendor = yield vendorModel_1.VendorInstance.create({
                    id: uuidVendor,
                    phone,
                    name,
                    email,
                    restaurantName,
                    pincode,
                    address,
                    password: vendorPassword,
                    salt,
                    role: "vendor",
                    rating: 0,
                    serviceAvailable: false,
                    coverImage: ''
                });
                return res.status(201).json({
                    message: "Vendor is created successfully",
                    createVendor,
                });
            }
            return res.status(201).json({
                message: "Vendor already exit",
            });
        }
        return res.status(400).json({
            message: "Unathourized",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            Error: "Internal Error Occur Here",
            error: error
        });
    }
});
exports.createVendor = createVendor;
