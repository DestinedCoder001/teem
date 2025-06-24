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
  firstName: {
    isString: {
      errorMessage: "First name must be a string",
    },
    notEmpty: {
      errorMessage: "First name is required",
    },
  },
  lastName: {
    isString: {
      errorMessage: "Last name must be a string",
    },
    notEmpty: {
      errorMessage: "Last name is required",
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

const loginValidation = checkSchema({
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

const newPasswordValidation = checkSchema({
  email: {
    isEmail: {
      errorMessage: "Please provide a valid email",
    },
    notEmpty: {
      errorMessage: "Email is required",
    },
    normalizeEmail: true,
  },
  newPassword: {
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be at least 6 characters long",
    },
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
});

export {
  authValidation,
  emailValidation,
  loginValidation,
  newPasswordValidation,
};
