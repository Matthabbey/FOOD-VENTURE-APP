import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { FoodAttributes, FoodInstance } from "../models/foodModel";
import { VendorAttributes, VendorInstance } from "../models/vendorModel";
import {
  GenerateSignature,
  loginSchema,
  option,
  validatePassword,
} from "../utils";
import { v4 as uuidv4 } from "uuid";

/**==============================Vendor Login================================ */

export const vendorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const validateResult = loginSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    //Check if the user exist
    const Vendor = (await VendorInstance.findOne({
      where: { email: email },
    })) as unknown as VendorAttributes;
    if (Vendor) {
      const validation = await validatePassword(
        password,
        Vendor.password,
        Vendor.salt
      );
      //   const validation = await bcrypt.compare(password, User.password)
      if (validation) {
        // Generate signature for vendor
        const signature = await GenerateSignature({
          id: Vendor.id,
          email: Vendor.email,
          serviceAvailabilty: Vendor.serviceAvailable,
        });
        return res.status(200).json({
          message: "You have successfully logged in",
          serviceAvailable: Vendor.serviceAvailable,
          email: Vendor.email,
          role: Vendor.role,
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
      route: "/vendor/login",
    });
  }
};

/**========================== Vendor Add Food ===================================== */

export const createFood = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.vendor.id;
    const { name, description, category, foodType, readyType, price } =
      req.body;

    //Check if the user exist
    const Vendor = (await VendorInstance.findOne({
      where: { id: id },
    })) as unknown as VendorAttributes;
    const foodid = uuidv4();

    if (Vendor) {
      const createFood = await FoodInstance.create({
        id: foodid,
        name,
        description,
        category,
        foodType,
        readyType,
        price,
        vendorID: id,
        rating: 0,
      });
      return res.status(201).json({
        message: "Food added successfully",
        createFood,
      });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      Error: "Internal Server error",
      route: "/vendors/create-food",
    });
  }
};

/**=============================  Vendor Profile  =============================== */
export const VendorProfile = async (req: JwtPayload, res: Response)=>{
    try {
        const id = req.vendor.id
        //Check if the user exist
        const Vendor = (await VendorInstance.findOne({
        where: { id: id },
        attributes: ["id", "email", "name", "ownerName", "address", "pincode", "serviceAvailable", "rating", "role", "phone"],
        include: [
            {
                model: FoodInstance,
                as: "food",
                attributes: ["id", "name", "description", "category", "foodType", "readyType", "price", "rating", "vendorID"]
            }
        ]
      })) as unknown as VendorAttributes;
      return res.status(200).json({
        Vendor
      })
    } catch (error) {
        res.status(500).json({
            Error: "Internal Server error!!!!!",
            route: "/vendors/vendor-profile",
          });
    }
}

/**===============================  Vendor Delete Food========================== */
export const deleteFood = async (req: JwtPayload, res: Response)=>{
    try {
        const id = req.vendor.id
        const foodid = req.params.foodid
        const Vendor = (await VendorInstance.findOne({
            where: { id: id },
          })) as unknown as VendorAttributes;

        if(Vendor){
            const deletedFood = await FoodInstance.destroy({where: {id: foodid}})
            return res.status(200).json({
                message: "You have successfully delete food",
                deletedFood
            })
        }
    } catch (error) {
        res.status(500).json({
            Error: "Internal Server error",
            route: "/vendors/vendor-profile",
          });
    }
}
