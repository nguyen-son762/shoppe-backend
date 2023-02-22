import { HttpException } from "@app/exception/httpException";
import { NextFunction } from "express";

export const throwError = (
  next: NextFunction,
  status = 400,
  msg = "There was an error on the server"
) => {
  next(new HttpException(status, msg));
};
