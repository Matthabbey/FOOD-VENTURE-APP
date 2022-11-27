import express, { Request, Response, NextFunction } from "express";

const router = express.Router();
router.get("/", (req: Request, res: Response) => {
  res.status(200).send("WElCOME TO THE SITE THAT WOULD CHANGE YOUR LIFE");
});

export default router;
