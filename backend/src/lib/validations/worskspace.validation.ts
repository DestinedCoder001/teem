import { checkSchema } from "express-validator";

const workspaceCreateValidation = checkSchema({
  name: {
    isString: {
      errorMessage: "Workspace name must be a string",
    },
    notEmpty: {
      errorMessage: "Workspace name is required",
    },
  },
});

export { workspaceCreateValidation };
