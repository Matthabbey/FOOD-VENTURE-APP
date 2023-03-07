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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFood = exports.updateVendorProfile = exports.VendorProfile = exports.createFood = exports.vendorLogin = void 0;
const foodModel_1 = require("../models/foodModel");
const vendorModel_1 = require("../models/vendorModel");
const utils_1 = require("../utils");
const uuid_1 = require("uuid");
/**==============================Vendor Login================================ */
const vendorLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //Check if the user exist
        const Vendor = (yield vendorModel_1.VendorInstance.findOne({
            where: { email: email },
        }));
        if (Vendor) {
            const validation = yield (0, utils_1.validatePassword)(password, Vendor.password, Vendor.salt);
            //   const validation = await bcrypt.compare(password, User.password)
            if (validation) {
                // Generate signature for vendor
                const signature = yield (0, utils_1.GenerateSignature)({
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
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/vendor/login",
        });
    }
});
exports.vendorLogin = vendorLogin;
/**========================== Vendor Create Food ===================================== */
const createFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.vendor.id;
        const { name, description, category, foodType, readyType, price, image } = req.body;
        //Check if the user exist
        const Vendor = (yield vendorModel_1.VendorInstance.findOne({
            where: { id: id },
        }));
        const foodid = (0, uuid_1.v4)();
        if (Vendor) {
            const createFood = yield foodModel_1.FoodInstance.create({
                id: foodid,
                name,
                description,
                category,
                foodType,
                readyType,
                price,
                vendorID: id,
                rating: 0,
                image: req.file.path
            });
            return res.status(201).json({
                message: "Food added successfully",
                createFood,
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            Error: "Internal Server error",
            route: "/vendors/create-food",
        });
    }
});
exports.createFood = createFood;
/**=============================  Vendor Profile  =============================== */
const VendorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.vendor.id;
        //Check if the user exist
        const Vendor = (yield vendorModel_1.VendorInstance.findOne({
            where: { id: id },
            attributes: [
                "id",
                "email",
                "name",
                "restuarantName",
                "address",
                "pincode",
                "serviceAvailable",
                "rating",
                "role",
                "phone",
            ],
            include: [
                {
                    model: foodModel_1.FoodInstance,
                    as: "food",
                    attributes: [
                        "id",
                        "name",
                        "description",
                        "category",
                        "foodType",
                        "readyType",
                        "price",
                        "rating",
                        "vendorID",
                    ],
                },
            ],
        }));
        return res.status(200).json({
            Vendor,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            Error: "Internal Server error!!!!!",
            route: "/vendors/vendor-profile",
        });
    }
});
exports.VendorProfile = VendorProfile;
/**===============================  updateVendor Food  ========================== */
const updateVendorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.vendor.id;
        const { phone, name, address, coverImage } = req.body;
        //Joi validation
        const validateResult = utils_1.updateVendorSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //Check if the user is a registered user
        const Vendor = (yield vendorModel_1.VendorInstance.findOne({
            where: { id: id },
        }));
        if (!Vendor) {
            return res.status(400).json({
                Error: "You are not authorized to update your profile",
            });
        }
        const vendorUser = (yield vendorModel_1.VendorInstance.update({ name, address, phone, coverImage: req.file.path }, { where: { id: id } }));
        if (vendorUser) {
            const Vendor = (yield vendorModel_1.VendorInstance.findOne({
                where: { id: id },
            }));
            return res.status(200).json({
                message: "You have successfully updated your profile",
                Vendor,
            });
        }
        return res.status(400).json({
            Error: "An error occurs",
        });
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "users/update-Vendor-profile",
        });
    }
});
exports.updateVendorProfile = updateVendorProfile;
/**===============================  Vendor Delete Food========================== */
const deleteFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.vendor.id;
        const foodid = req.params.foodid;
        const Vendor = (yield vendorModel_1.VendorInstance.findOne({
            where: { id: id },
        }));
        if (Vendor) {
            const deletedFood = yield foodModel_1.FoodInstance.destroy({ where: { id: foodid } });
            return res.status(200).json({
                message: "You have successfully delete food",
                deletedFood,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal Server error",
            route: "/vendors/vendor-profile",
        });
    }
});
exports.deleteFood = deleteFood;
