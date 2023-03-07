import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user";
import indexRouter from "./routes/index";
import adminRouter from "./routes/admin";
import vendorRouter from "./routes/vendor";
import { db } from "./config";
import dotenv from 'dotenv'
dotenv.config() // You should have your dotenv file in where you create your server, it can either be in bin or app

//Sequelize connection to dataBase
db.sync()
  .then(() => {
    console.log("DB connected successfully!!!!");
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();

app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());

//ROUTE middleware
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/admins", adminRouter);
app.use("/vendors", vendorRouter);

// app.get('/about', (req: Request, res: Response)=>{
//     res.status(200).json({
//         message: "Successfully"
//     })

// })

const port = 4000;

app.listen(port, () => {
  console.log(`Server runing on http://${port}`);
});

export default app;
