import { NextFunction, Request, Response } from "express";
import { HttpException } from "@app/exception/httpException";

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  return response.status(status).json({
    status,
    message,
  });
}

export default errorMiddleware;
