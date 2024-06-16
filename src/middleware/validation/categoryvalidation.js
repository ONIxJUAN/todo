import { body } from "express-validator";

export default [
  body("categorie")
    .notEmpty()
    .withMessage(
      "You have to first fill something in before u can add a category"
    )
    .bail()
    .isLength({ min: 5 })
    .withMessage("You have to atleast fill in 5+ chars"),
];
