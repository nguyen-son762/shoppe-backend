import { body } from "express-validator";

export const registerSchema = [
  body("email").isEmail().withMessage("email must contain a valid email address"),
  body("first_name")
    .isLength({
      min: 2,
    })
    .withMessage("first_name must be at least 2 characters long"),
  body("last_name")
    .isLength({
      min: 2,
    })
    .withMessage("last_name must be at least 2 characters long"),
  body("password").isLength({ min: 5 }).withMessage("password must be at least 5 characters long"),
  body("phone_number")
    .isLength({
      min: 8,
      max: 15,
    })
    .withMessage("phone_number must be min 8 characters"),
];

export const loginSchema = [
  body("email").isEmail().withMessage("email must contain a valid email address"),
  body("password").isLength({ min: 5 }).withMessage("password must be at least 5 characters long"),
];
