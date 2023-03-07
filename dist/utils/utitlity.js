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
exports.updateVendorSchema = exports.vendorSchema = exports.adminSchema = exports.updateSchema = exports.validatePassword = exports.verifySignature = exports.GenerateSignature = exports.GeneratePassword = exports.GenerateSalt = exports.option = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
//Joi declaration of the required input field from the user to register as a new member.
exports.registerSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().regex(/[a-z0-9]{3,30}/),
    address: joi_1.default.string().required(),
    // confirm_password: Joi.ref('password')
    confirm_password: joi_1.default.any()
        .equal(joi_1.default.ref("password"))
        .required()
        .label("Confirm password")
        .messages({ "any.only": "{{#label}} does not match here" }),
});
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().regex(/[a-z0-9]{3,30}/),
});
//To remove the unnecessary character that includes in console.log output of the user error message.
exports.option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: "",
        },
    },
};
// Generating of salt code
const GenerateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt();
});
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, salt);
});
exports.GeneratePassword = GeneratePassword;
//generating token or signature for the user.
const GenerateSignature = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.sign(payload, config_1.APP_SECRET, { expiresIn: "1d" }); //for week use 'w', for month use 'm', for day use 'd', for minutes use 'min', for hour use 'hour'
});
exports.GenerateSignature = GenerateSignature;
//Verifying the signature of the user before allowing login
const verifySignature = (signature) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.verify(signature, config_1.APP_SECRET);
});
exports.verifySignature = verifySignature;
const validatePassword = (enteredPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.GeneratePassword)(enteredPassword, salt)) === savedPassword;
});
exports.validatePassword = validatePassword;
exports.updateSchema = joi_1.default.object().keys({
    firstName: joi_1.default.string(),
    lastName: joi_1.default.string(),
    address: joi_1.default.string(),
    phone: joi_1.default.string(),
});
exports.adminSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().regex(/[a-z0-9]{3,30}/),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
});
exports.vendorSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    pincode: joi_1.default.string().required(),
    password: joi_1.default.string().regex(/[a-z0-9]{3,30}/),
    restaurantName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
});
exports.updateVendorSchema = joi_1.default.object().keys({
    name: joi_1.default.string(),
    address: joi_1.default.string(),
    coverImage: joi_1.default.string(),
    phone: joi_1.default.string(),
});
