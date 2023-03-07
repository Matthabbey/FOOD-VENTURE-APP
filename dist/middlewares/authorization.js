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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authVendor = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const userModel_1 = require("../models/userModel");
const vendorModel_1 = require("../models/vendorModel");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                message: "Kindly signin as a user"
            });
        }
        const token = authorization.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, config_1.APP_SECRET);
        if (!verified) {
            return res.status(401).json({
                message: "User not authorized"
            });
        }
        const { id } = verified;
        // Find the user by id
        const user = yield userModel_1.UserInstance.findOne({ where: { id: id } });
        if (!user) {
            return res.status(401).json({
                Error: "Invalid Credentials"
            });
        }
        req.user = verified;
        next();
    }
    catch (error) {
        return res.status(401).json({
            Error: "Unaothorized user"
        });
    }
});
exports.auth = auth;
const authVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                message: "Kindly signin as a user"
            });
        }
        //Bearer encrpttyyyyy
        const token = authorization.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, config_1.APP_SECRET);
        if (!verified) {
            return res.status(401).json({
                message: "User not authorized"
            });
        }
        const { id } = verified;
        // Find the vendor by id
        const vendor = yield vendorModel_1.VendorInstance.findOne({ where: { id: id } });
        if (!vendor) {
            return res.status(401).json({
                Error: "Invalid Credentials"
            });
        }
        req.vendor = verified;
        next();
    }
    catch (error) {
        return res.status(401).json({
            Error: "Unaothorized user"
        });
    }
});
exports.authVendor = authVendor;
