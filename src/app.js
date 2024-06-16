import express from "express";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
import { create } from "express-handlebars";
import bodyParser from "body-parser";
import { home, login, logout, register } from "./controllers/controller.js";
import {
  postTask,
  taskChanges,
  addCat,
  sendMail,
  tryLogin,
  tryRegister,
  catChanges,
} from "./controllers/api/controller.js";
import { handlebarsHelpers } from "./lib/handlebarsHelper.js";
import categoryvalidation from "./middleware/validation/categoryvalidation.js";
import taskvalidation from "./middleware/validation/taskvalidation.js";
import mailvalidation from "./middleware/validation/mailvalidation.js";
import authloginvalidation from "./middleware/validation/AuthLoginValidation.js";
import authregistervalidation from "./middleware/validation/AuthRegisterValidation.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
const port = process.env.PORT;

const hbs = create({
  helpers: handlebarsHelpers,
  extname: "hbs",
});

app.use(express.static("public"));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(path.resolve("src"), "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", home);
app.get("/login", login);
app.get("/register", register);
app.get("/logout", logout);
app.post("/api/login", authloginvalidation, tryLogin, login);
app.post("/api/register", authregistervalidation, tryRegister, register);
app.post("/api/addtask", taskvalidation, postTask);
app.post("/api/addcat", categoryvalidation, addCat);
app.post("/api/sendmail", mailvalidation, sendMail);
app.post("/api/taskchanges", taskChanges);
app.post("/api/catchanges", catChanges);

app.listen(port, () => {
  console.log("example app listening on port", `http://localhost:${port}`);
});
