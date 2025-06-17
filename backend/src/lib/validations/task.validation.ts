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
  summary: {
    isString: {
      errorMessage: "Summary must be a string",
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
