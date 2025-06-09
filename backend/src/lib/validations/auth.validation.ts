import { checkSchema } from "express-validator";

const authValidation = checkSchema({
  email: {
    isEmail: {
      errorMessage: "Please provide a valid email",
    },
    notEmpty: {
      errorMessage: "Email is required",
    },
    normalizeEmail: true,
  },
  password: {
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be at least 6 characters long",
    },
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
});

const emailValidation = checkSchema({
  email: {
    isEmail: {
      errorMessage: "Please provide a valid email",
    },
    notEmpty: {
      errorMessage: "Email is required",
    },
    normalizeEmail: true,
  },
});

export { authValidation, emailValidation };
