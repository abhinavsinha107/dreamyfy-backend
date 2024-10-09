import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Middleware function to check authentication it send role id to next middleware
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  const accessToken = token?.split("Bearer ")[1];

  if (!accessToken) return res.status(401).json({ message: "" });

  jwt.verify(
    accessToken,
    process.env.JWT_SECRET || "",
    (err: any, user: any) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      console.log(user);
      req.user = user;
      next();
    }
  );
};
