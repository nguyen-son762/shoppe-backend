import { decodeToken } from "../utils/auth";
import { NextFunction, Request, Response } from "express";

export function authMiddleware (req: Request, res: Response, next: NextFunction) {
  const token = (req.header("Authorization") || "").replace("Bearer ", "");
  const user = decodeToken(token);
  if (user) {
    next();
  } else {
    return res.status(401).json({ message: "Not authorized to access this resource" });
  }
}
