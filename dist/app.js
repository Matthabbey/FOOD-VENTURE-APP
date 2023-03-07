"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_1 = __importDefault(require("./routes/user"));
const index_1 = __importDefault(require("./routes/index"));
const admin_1 = __importDefault(require("./routes/admin"));
const vendor_1 = __importDefault(require("./routes/vendor"));
const config_1 = require("./config");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // You should have your dotenv file in where you create your server, it can either be in bin or app
//Sequelize connection to dataBase
config_1.db.sync()
    .then(() => {
    console.log("DB connected successfully!!!!");
})
    .catch((error) => {
    console.log(error);
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
//ROUTE middleware
app.use("/", index_1.default);
app.use("/user", user_1.default);
app.use("/admins", admin_1.default);
app.use("/vendors", vendor_1.default);
// app.get('/about', (req: Request, res: Response)=>{
//     res.status(200).json({
//         message: "Successfully"
//     })
// })
const port = 4000;
app.listen(port, () => {
    console.log(`Server runing on http://${port}`);
});
exports.default = app;
