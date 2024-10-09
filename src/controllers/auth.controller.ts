import { Request, Response } from "express";
import User, { IUser } from "../schema/user.schema";
import { createResponse } from "../helper/response";
import bcrypt from "bcrypt";
import { generateToken } from "../services/auth";
import createHttpError from "http-errors";

export const createUser = async (req: Request, res: Response) => {
  let userData: IUser = req.body;
  const hashedPwd = await bcrypt.hash(req.body.password, 10);
  userData = { ...userData, password: hashedPwd };
  const user = new User(userData);
  await user.save();
  const { name, email, role, _id } = user;
  const responseUser = { name, email, role, _id };
  res.send(
    createResponse({ user: responseUser }, `New user ${req.body.name} created`)
  );
};

export const loginUser = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw createHttpError(401, {
      message: "Invalid email",
    });
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordValid) {
    throw createHttpError(401, {
      message: "Invalid password",
    });
  }
  const token = generateToken(user);
  const { name, email, role, _id } = user;
  const responseUser = { name, email, role, _id };
  res.send(
    createResponse(
      { accessToken: token, user: responseUser },
      "Login successful"
    )
  );
};

export const loginWithOAuth = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = generateToken(user);
    const { name, email, role, _id } = user;
    const responseUser = { name, email, role, _id };
    res.send(
      createResponse(
        { accessToken: token, user: responseUser },
        "Login successful"
      )
    );
  } else {
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = generateToken(newUser);
    const { name, email, role, _id } = newUser;
    const responseUser = { name, email, role, _id };
    res.send(
      createResponse(
        { accessToken: token, user: responseUser },
        "Login successful"
      )
    );
  }
};
