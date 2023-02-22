import jwt from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { TIME_EXPIRED_ACCESS_TOKEN_HOURS, SALT_ROUNDS } from "@app/constants/auth.constant";
import { UserDocument } from "@models/user.model";
import { getEnv } from "./env";

export const getToken = (user: UserDocument, expired?: number | string) => {
  if (!expired) {
    expired = `${TIME_EXPIRED_ACCESS_TOKEN_HOURS}h`;
  }
  return jwt.sign(user.toJSON(), getEnv("JWT_SECRET_KEY"), {
    expiresIn: expired,
  });
};

export const decodeToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, getEnv("JWT_SECRET_KEY"));
    return decoded;
  } catch {
    return "";
  }
};

export const encodePassword = async (password: string) => {
  return await hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hashPassword: string) => {
  return await compare(password, hashPassword);
};
