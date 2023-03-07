import express, { Request, Response } from "express";
import {
  registerSchema,
  option,
  GeneratePassword,
  GenerateSalt,
  GenerateOTP,
  onRequestOTP,
  emailHtml,
  mailSent,
  GenerateSignature,
  verifySignature,
  loginSchema,
  validatePassword,
  updateSchema,
} from "../utils";
import { UserAttributes, UserInstance } from "../models/userModel";
import { v4 as uuidv4 } from "uuid";
import { FromAdminMail, userSubject } from "../config/index";
import { JwtPayload } from "jsonwebtoken";

export const Register = async (req: Request, res: Response) => {
  try {
    const { email, phone, password, address, confirm_password } = req.body;
    const uuiduser = uuidv4();
    const validateResult = registerSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    //Generate Salt
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    //Generate OTP.
    const { otp, expiry } = GenerateOTP();

    //Check if the user exist.
    const User = await UserInstance.findOne({ where: { email: email } });

    if (!User) {
      const user = await UserInstance.create({
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
      await onRequestOTP(otp, phone);

      //Send Email
      const html = emailHtml(otp);

      await mailSent(FromAdminMail, email, userSubject, html);

      //Check if the user exist.
      const User = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as UserAttributes;

      //Generate a signature
      const signature = await GenerateSignature({
        id: User.id,
        email: User.email,
        verified: User.verified,
      });
      console.log(signature)

      return res.status(201).json({
        messsage: "User successfully created",
        signature,
      });
    }
    return res.status(400).json({
      message: "User already exit",
    });

    //console.log(userPassword)
  } catch (error) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/user/signup",
    });
    console.log(error);
  }
};

/**============================Verifying User to Login==============================**/
export const verifyUser = async (req: Request, res: Response) => {
  try {
    const token = req.params.signature;
    const decode = await verifySignature(token);
    console.log(decode);

    //check if the user is a registered user
    const User = (await UserInstance.findOne({
      where: { email: decode.email },
    })) as unknown as UserAttributes; //we are getting email from the awaiting of verifySignature

    //Getting the otp sent to the user by email or sms by requesting the validaty of the token
    if (User) {
      const { otp } = req.body;
      console.log(typeof User.otp);
      if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
        // User.verified == true
        // const updatedUser = await User.update()
        const updatedUser = (await UserInstance.update(
          { verified: true },
          { where: { email: decode.email } }
        )) as unknown as UserAttributes;

        //Generate another signature for the validated or {updatedUser} verified account
        const signature = await GenerateSignature({
          id: updatedUser.id,
          email: updatedUser.email,
          verified: updatedUser.verified,
        });

        if (updatedUser) {
          const User = (await UserInstance.findOne({
            where: { email: decode.email },
          })) as unknown as UserAttributes;

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
  } catch (error) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "users/verify",
    });
  }
};

/**==========================Login User ================================ */

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const validateResult = loginSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    //Check if the user exist
    const User = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as UserAttributes;
    if (User.verified === true) {
      const validation = await validatePassword(
        password,
        User.password,
        User.salt
      );
      //   const validation = await bcrypt.compare(password, User.password)
      if (validation) {
        const signature = await GenerateSignature({
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
  } catch (error) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/user/signup",
    });
    console.log(error);
  }
};

/** ==========================Resend OTP ================================ */

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const token = req.params.signature;
    const decode = await verifySignature(token);
    // console.log(decode)

    //check if the user is a registered user
    const User = (await UserInstance.findOne({
      where: { email: decode.email },
    })) as unknown as UserAttributes;
    if (User) {
      const { otp, expiry } = GenerateOTP();
      const updatedUser = (await UserInstance.update(
        { otp, otp_expiry: expiry },
        { where: { email: decode.email } }
      )) as unknown as UserAttributes;

      if (updatedUser) {
        const User = (await UserInstance.findOne({
          where: { email: decode.email },
        })) as unknown as UserAttributes;
        //send otp to user
        await onRequestOTP(otp, User.phone);

        // send Mail to User
        const html = emailHtml(otp);
        await mailSent(FromAdminMail, User.email, userSubject, html);

        return res.status(200).json({
          message: "OTP has been resend to registered phone number and email",
        });
      }
    }
    return res.status(400).json({ Error: "Error sending OTP to User" });
  } catch (error) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "users/resend-otp/:signature",
    });
  }
};

/** ========================== PROFILE ================================ */

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
    const limit: any = req.query.limit; // as number | undefined
    const users = await UserInstance.findAndCountAll({ limit: limit });
    return res.status(200).json({
      message: "You have successfully retrieved all users in your database",
      Count: users.count,
      User: users.rows,
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "users/get-all-users",
    });
  }
};

export const getSingleUser = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.user.id;
    const User = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttributes;

    return res.status(200).json({
      User,
    });
  } catch (error) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "users/get-users",
    });
  }
};

export const updateUserProfile = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.user.id;
    const { firstName, lastName, address, phone } = req.body;

    //Joi validation
    const validateResult = updateSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    //Check if the user is a registered user
    const User = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttributes;
    if (!User) {
      return res.status(400).json({
        Error: "You are not authorized to update your profile",
      });
    }
    const updatedUser = (await UserInstance.update(
      { firstName, lastName, address, phone },
      { where: { id: id } }
    )) as unknown as UserAttributes;

    if (updatedUser) {
      const User = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as UserAttributes;
      return res.status(200).json({
        message: "You have successfully updated your profile",
      });
    }
    return res.status(400).json({
      Error: "An error occurs",
    });
  } catch (error) {
    return res.status(500).json({
      Error: "Internal server Error",
      route: "users/update-user-profile",
    });
  }
};
