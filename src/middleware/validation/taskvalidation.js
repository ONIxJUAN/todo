import { body } from "express-validator";

export default [
  body("task")
    .notEmpty()
    .withMessage(
      "You have to first fill something in before u can add a task"
    )
    .bail()
    .isLength({ min: 5 })
    .withMessage("You have to atleast give in 5+ chars"),
];
