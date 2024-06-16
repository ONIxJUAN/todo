import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

import hbs from "nodemailer-express-handlebars";
import path from "path";
import { VIEWS_PATH } from "../consts.js";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "localhost",
  port: process.env.MAIL_PORT || 1025,
  auth: {
    user: process.env.MAIL_USER || "project.1",
    pass: process.env.MAIL_PASS || "secret.1",
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.join(VIEWS_PATH, "partials"),
      layoutsDir: path.join(VIEWS_PATH, "layouts"),
      defaultLayout: "mail.hbs",
    },
    viewPath: path.join(VIEWS_PATH, "emails"),
    extName: ".hbs",
  })
);

export default transporter;
