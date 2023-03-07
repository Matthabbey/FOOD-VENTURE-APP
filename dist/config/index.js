"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_SECRET = exports.userSubject = exports.FromAdminMail = exports.GMAIL_PASSWORD = exports.GMAIL_USER = exports.fromAdminPhone = exports.authToken = exports.AccountSID = exports.db = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.db = new sequelize_1.Sequelize('app', '', '', {
    storage: './food.sqlite',
    dialect: 'sqlite',
    logging: false
});
exports.AccountSID = process.env.AccountSID;
exports.authToken = process.env.authToken;
exports.fromAdminPhone = process.env.fromAdminPhone;
exports.GMAIL_USER = process.env.GMAIL_USER;
exports.GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
exports.FromAdminMail = process.env.FromAdminMail;
exports.userSubject = process.env.userSubject;
exports.APP_SECRET = process.env.APP_SECRET; // alternative for "as string" is '!'
