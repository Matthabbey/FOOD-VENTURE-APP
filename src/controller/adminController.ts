import express, { Request, Response } from "express";
import {
  GenerateOTP,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  option,
  adminSchema,
  vendorSchema,
} from "../utils";
import { UserAttributes, UserInstance } from "../models/userModel";
import { v4 as uuidv4 } from "uuid";
import { JwtPayload } from "jsonwebtoken";
import { VendorAttributes, VendorInstance } from "../models/vendorModel";

export const AdminRegister = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.user.id;
    const { email, phone, password, address, lastName, firstName } = req.body;
    const uuiduser = uuidv4();

    const validateResult = adminSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    //Generate Salt
    const salt = await GenerateSalt();
    const AdminPassword = await GeneratePassword(password, salt);

    //Generate OTP.
    const { otp, expiry } = GenerateOTP();

    //Check if the user exist.
    const Admin = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttributes;
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
      const user = await UserInstance.create({
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
      const Admin = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as UserAttributes;

      //Generate a signature
      const signature = await GenerateSignature({
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
  } catch (error) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/admin/signup",
    });
  }
};

/** ================= Super Admin ===================== **/
export const SuperAdmin = async (req: JwtPayload, res: Response) => {
  try {
    const { email, phone, password, firstName, lastName, address } = req.body;
    const uuiduser = uuidv4();

    const validateResult = adminSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    // Generate salt
    const salt = await GenerateSalt();
    const adminPassword = await GeneratePassword(password, salt);

    // Generate OTP
    const { otp, expiry } = GenerateOTP();

    // check if the admin exist
    const Admin = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as UserAttributes;

    //Create Admin
    if (!Admin) {
      await UserInstance.create({
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
      const Admin = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as UserAttributes;

      //Generate signature for user
      let signature = await GenerateSignature({
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
  } catch (error) {
    console.log(error)
    res.status(500).json({
      Error: "Internal server Error",
      route: "/admins/create-admin",
    });
  }
};

/**-============================== Create Vendor ============================ */

export const createVendor = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.user.id;
    // console.log(id)
    const { name, restaurantName, pincode, phone, address, email, password } = req.body;
    const validateResult = vendorSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    // const {email, password, name, ownerName, pincode, address, phone} = req.body
    const salt = await GenerateSalt();
    const vendorPassword = await GeneratePassword(password, salt);
    const uuidVendor = uuidv4();


    //Generate OTP.
    const { otp, expiry } = GenerateOTP();

    //Check if the user exist.
    const Vendor = (await VendorInstance.findOne({
      where: { email: email },
    })) as unknown as VendorAttributes;


    // if (Vendor.email === email) {
    //   return res.status(400).json({
    //     message: "Email Already",
    //   });
    // }

    const Admin = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttributes;
    console.log("I am here now")


    if (Admin.role === "admin" || Admin.role === "superadmin"){
      if (!Vendor) {
        const createVendor = await VendorInstance.create({
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

  } catch (error) {
    console.log(error)
    res.status(500).json({
      Error: "Internal Error Occur Here",
      error: error
    });
  }
};
