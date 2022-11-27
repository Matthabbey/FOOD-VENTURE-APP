import express from "express";
import { authVendor } from "../middlewares/authorization";
import { createFood, deleteFood, vendorLogin, VendorProfile } from "../controller/vendorController";

const router = express.Router();

router.post("/login", vendorLogin);
router.post("/create-food", authVendor, createFood);
router.get('/get-profile', authVendor, VendorProfile)
router.delete('/delete-food/:foodid', authVendor, deleteFood)

export default router;