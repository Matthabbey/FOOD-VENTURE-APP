"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInstance = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
class UserInstance extends sequelize_1.Model {
}
exports.UserInstance = UserInstance;
UserInstance.init({
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
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
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
    otp: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "OTP is required",
            },
        },
    },
    otp_expiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: {
                msg: "OTP is required",
            },
        },
    },
    lat: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true,
    },
    lng: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true,
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: {
                msg: "User must be verified",
            },
            notEmpty: {
                msg: "User not verified",
            },
        },
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: config_1.db,
    tableName: "User",
});
