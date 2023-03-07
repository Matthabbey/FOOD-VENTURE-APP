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
exports.emailHtml = exports.mailSent = exports.onRequestOTP = exports.GenerateOTP = void 0;
const index_1 = require("../config/index");
const nodemailer_1 = __importDefault(require("nodemailer"));
const GenerateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp, expiry };
};
exports.GenerateOTP = GenerateOTP;
const onRequestOTP = (otp, toPhoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const client = require("twilio")(index_1.AccountSID, index_1.authToken);
    const response = yield client.messages.create({
        body: `Your OTP is ${otp} `,
        to: toPhoneNumber,
        from: index_1.fromAdminPhone,
    });
    return response;
});
exports.onRequestOTP = onRequestOTP;
const transport = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: index_1.GMAIL_USER,
        pass: index_1.GMAIL_PASSWORD, // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false,
    },
});
const mailSent = (from, //'"Fred Foo 👻" <foo@example.com>', // sender address
to, //"bar@example.com, baz@example.com", // list of receivers
subject, //"Hello ✔", // Subject line
html //"<b>Hello world?</b>", // html body
) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield transport.sendMail({
            from: index_1.FromAdminMail,
            to,
            subject: index_1.userSubject,
            html,
        });
        return response;
    }
    catch (error) {
        console.log(error);
    }
});
exports.mailSent = mailSent;
const emailHtml = (otp) => {
    let response = `
        <div style='max-width: 700px; margin:auto; border:10px solid #ddd; padding:50px 20px; font-size: 110%;'>

        <h2 style="text-align: center; text-transform: uppercase; color:teal;"> Welcome to Matthabbey Store </h2>
        <p>Hi ${index_1.userSubject} Welcome to MATTHABBEY-STORE</p>
        <p> , your otp is ${otp}</p>


        </div>
    `;
    return response;
};
exports.emailHtml = emailHtml;
