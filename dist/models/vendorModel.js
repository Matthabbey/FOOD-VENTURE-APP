"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorInstance = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const foodModel_1 = require("./foodModel");
class VendorInstance extends sequelize_1.Model {
}
exports.VendorInstance = VendorInstance;
VendorInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
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
        type: sequelize_1.DataTypes.STRING,
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
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    restaurantName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    salt: {
        type: sequelize_1.DataTypes.STRING,
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
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
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
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    rating: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true,
    },
    serviceAvailable: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    coverImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: config_1.db,
    tableName: "Vendor",
});
VendorInstance.hasMany(foodModel_1.FoodInstance, { foreignKey: "vendorID", as: "food" });
foodModel_1.FoodInstance.belongsTo(VendorInstance, { foreignKey: "vendorID", as: "vendor" });
