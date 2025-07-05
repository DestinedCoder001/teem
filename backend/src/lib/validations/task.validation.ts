import { checkSchema } from "express-validator";

export const createTaskValidation = checkSchema({
  title: {
    notEmpty: {
      errorMessage: "Title is required",
    },
    isString: {
      errorMessage: "Title must be a string",
    },
    trim: true,
  },
  guidelines: {
    isString: {
      errorMessage: "Summary must be a string",
    },
    isLength: {
      options: { min: 10, max: 200 },
      errorMessage: "Summary must be between 10 and 200 characters",
    },
    trim: true,
  },
  dueDate: {
    notEmpty: {
      errorMessage: "Due date is required",
    },
    isISO8601: {
      errorMessage: "Due date must be a valid date string (ISO format)",
    },
    toDate: true,
  },
});
