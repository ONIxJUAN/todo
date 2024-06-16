import { body } from "express-validator";

export default [
  body("email")
    .notEmpty()
    .withMessage("You have to first fill something in before u can send a mail")
    .bail()
    .isEmail()
    .withMessage("You have to fill in a real email to send a mail"),
];
