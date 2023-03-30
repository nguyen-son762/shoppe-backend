import express from "express";
import multer from "multer";
import { authEndpoints } from "@app/constants/route.constant";
import { validateRequestSchema } from "@app/middleware/validate.middleware";
import { loginSchema, registerSchema } from "@app/schema/auth.schema";
import { UsersController } from "@controllers/user.controller";

const storage = multer.memoryStorage();
export const userRoutes = express.Router();
const uploadImage = multer({
  storage: storage,
  limits: {
    fieldSize: 50 * 1024 * 1024,
  },
}).single("avatar_url");

userRoutes.post(authEndpoints.LOGIN, loginSchema, validateRequestSchema, UsersController.login);

userRoutes.post(authEndpoints.LOGIN_WITH_PLATFORM, UsersController.loginWithGoogleOrFacebook);

userRoutes.post(
  authEndpoints.REGISTER,
  registerSchema,
  validateRequestSchema,
  UsersController.register
);

userRoutes.post(
  authEndpoints.REGISTER_BY_PHONE_NUMBER,
  validateRequestSchema,
  UsersController.registerByPhonenumber
);

userRoutes.patch(authEndpoints.UPDATE, uploadImage, UsersController.update);

userRoutes.post(authEndpoints.VERIFY, UsersController.verifyOTP);
