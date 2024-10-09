import mongoose from "mongoose";
import { type Response, type Request, type NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import {
  userLogin,
  createUser,
  otpLogin,
  checkOtp,
  resetPassword,
  changePassword,
  userUpdate,
  userLoginWithOAuth,
  createTecaher,
} from "../helper/validations/user";
import { uploadFile } from "../helper/validations/file";
import { createCourse, updateCourse } from "../helper/validations/course";
import { createClass, updateClass } from "../helper/validations/class";
import { createSubject, updateSubject } from "../helper/validations/subject";

export const validate = (validationName: string): any[] => {
  switch (validationName) {
    case "users:create": {
      return [createUser];
    }
    case "users:login": {
      return [userLogin];
    }
    case "users:loginWithOAuth": {
      return [userLoginWithOAuth];
    }
    case "user:forgot-password": {
      return [otpLogin];
    }
    case "users:update": {
      return [userUpdate];
    }
    case "user:verify-otp": {
      return [checkOtp];
    }
    case "users:reset-password": {
      return [resetPassword];
    }
    case "users:change-password": {
      return [changePassword];
    }
    case "upload:file": {
      return [uploadFile];
    }
    case "courses:create": {
      return [createCourse];
    }
    case "classes:create": {
      return [createClass];
    }
    case "classes:update": {
      return [updateClass];
    }
    case "subject:create": {
      return [createSubject];
    }
    case "subject:update": {
      return [updateSubject];
    }
    case "teacher:create": {
      return [createTecaher];
    }
    default:
      return [];
  }
};

export const validateIdParam = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];
    if (!mongoose.isObjectIdOrHexString(id)) {
      throw createHttpError(400, `Invalid ${paramName}`);
    }
    next();
  };
};

export const catchError = expressAsyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const isError = errors.isEmpty();
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!isError) {
      const data = { errors: errors.array() };
      throw createHttpError(400, {
        message: "Validation error!",
        data,
      });
    } else {
      next();
    }
  }
);
