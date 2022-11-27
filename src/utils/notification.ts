import {
  AccountSID,
  authToken,
  FromAdminMail,
  fromAdminPhone,
  GMAIL_PASSWORD,
  GMAIL_USER,
  userSubject,
} from "../config/index";
import nodemailer from "nodemailer";

export const GenerateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  const expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  const client = require("twilio")(AccountSID, authToken);

  const response = await client.messages.create({
    body: `Your OTP is ${otp} `,
    to: toPhoneNumber,
    from: fromAdminPhone,
  });
  return response;
};

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER, // generated ethereal user
    pass: GMAIL_PASSWORD, // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const mailSent = async (
  from: string, //'"Fred Foo 👻" <foo@example.com>', // sender address
  to: string, //"bar@example.com, baz@example.com", // list of receivers
  subject: string, //"Hello ✔", // Subject line
  html: string //"<b>Hello world?</b>", // html body
) => {
  try {
    const response = await transport.sendMail({
      from: FromAdminMail,
      to,
      subject: userSubject,
      html,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const emailHtml = (otp: number) => {
  let response = `
        <div style='max-width: 700px; margin:auto; border:10px solid #ddd; padding:50px 20px; font-size: 110%;'>

        <h2 style="text-align: center; text-transform: uppercase; color:teal;"> Welcome to Matthabbey Store </h2>
        <p>Hi ${userSubject} Welcome to MATTHABBEY-STORE</p>
        <p> , your otp is ${otp}</p>


        </div>
    `;
  return response;
};
