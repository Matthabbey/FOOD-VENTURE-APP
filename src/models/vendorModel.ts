import { DataTypes, Model } from "sequelize";
import { db } from "../config";
import { FoodInstance } from "./foodModel";

export interface VendorAttributes {
  id: string;
  name: string;
  email: string;
  ownerName: string;
  pincode: string;
  phone: string;
  password: string;
  salt: string;
  address: string;
  serviceAvailable: boolean;
  rating: number;
  role: string;
}

export class VendorInstance extends Model<VendorAttributes> {}

VendorInstance.init({
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Email address is required",
        },
        isEmail: {
          msg: "Please provide a valid email",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "password is required",
        },
        notEmpty: {
          msg: "provide a password",
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Salt is required",
        },
        notEmpty: {
          msg: "Provide a salt",
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Phone is required",
        },
        notEmpty: {
          msg: "Provide phone number",
        },
      },
    },

    pincode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    serviceAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: "Vendor",
  }
);

VendorInstance.hasMany(FoodInstance, { foreignKey: "vendorID", as: "food" });

FoodInstance.belongsTo(VendorInstance, {foreignKey: "vendorID", as: "vendor"});
