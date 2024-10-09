import { check } from "express-validator";

export const uploadFile = [
  check("file")
    .custom((value, { req }) => {
      console.log(req.file, "req.file");
      if (!req.file) {
        throw new Error("Profile picture is required");
      }
      return true;
    })
    .bail(),
];
