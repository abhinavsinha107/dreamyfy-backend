import jwt from "jsonwebtoken";
import { IUser } from "schema/user.schema";

export const generateToken = (user: IUser) => {
  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || ""
  );
  return token;
};
