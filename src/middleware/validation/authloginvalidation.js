import { body } from "express-validator";

export default [
  body("email")
    .notEmpty()
    .withMessage("E-mail is verplicht")
    .bail()
    .isEmail()
    .withMessage("Vul een geldig e-mail adres in"),
  body("password")
    .notEmpty()
    .withMessage("Wachtwoord is verplicht"),
];
