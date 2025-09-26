// middlewares/validateUser.js
import { body, validationResult } from "express-validator";

export const validateUser = [
  body("name")
    .notEmpty()
    .withMessage("Name is required."),

  body("email")
    .isEmail()
    .withMessage("Invalid email format.")
    .custom(value => {
      if (!value.includes("@") || !value.endsWith(".com")) {
        throw new Error("Email must contain '@' and end with '.com'.");
      }
      return true;
    }),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),

  body("mobile")
    .isMobilePhone()
    .withMessage("Invalid mobile number.")
    .custom(value => {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value)) {
        throw new Error("Mobile number must contain exactly 10 digits.");
      }
      return true;
    }),

  body("address")
    .optional()
    .notEmpty()
    .withMessage("Address cannot be empty if provided."),

  body("gender")
    .optional()
    .custom(value => {
      if (!["male", "female", "other"].includes(value.toLowerCase())) {
        throw new Error("Invalid gender value. Must be 'male', 'female', or 'other'.");
      }
      return true;
    }),

  // Final middleware to handle validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
