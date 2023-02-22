import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "@app/constants/code.constant";
import { decodeToken, getToken } from "@app/utils/auth";
import { throwError } from "@app/utils/error";
import { UserModel, UserDef, UserDocument } from "@models/user.model";
import { TIME_EXPIRED_REFRESH_TOKEN_HOURS } from "@app/constants/auth.constant";
import { UserService } from "@app/services/auth.service";
import { uploadPicture } from "@app/utils/upload";
import { UploadApiResponse } from "cloudinary";
import { sendSMS } from "@app/utils/sms";
import otpGenerator from "otp-generator";

interface UserResponseDef {
  data: UserDocument;
  access_token: string;
  refresh_token: string;
}

export class UsersController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, first_name, last_name, email, phone_number, password }: UserDef = req.body;
      const otp = otpGenerator.generate(4, {
        specialChars: false,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
      });
      // await sendSMS(phone_number, `Your Shopee Fake verification code: ${otp}`);
      const newUser = await UserService.register({
        username,
        first_name,
        last_name,
        email,
        phone_number,
        password,
        otp,
        active: false,
      });
      const result: UserResponseDef = {
        data: newUser,
        access_token: getToken(newUser),
        refresh_token: newUser.refresh_token,
      };
      res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return throwError(next, err?.status, err?.message);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password }: UserDef = req.body;
      const user = await UserService.login({ email, password });
      const pwdDecoded = decodeToken(user.refresh_token);
      let refresh_token = user.refresh_token;
      let userNeedUpdated: UserDocument;
      if (!pwdDecoded) {
        const newToken = getToken(user, `${TIME_EXPIRED_REFRESH_TOKEN_HOURS}h`);
        userNeedUpdated = await UserModel.findOneAndUpdate(
          {
            _id: user.id,
          },
          {
            refresh_token: newToken,
          },
          {
            new: true,
          }
        );
        refresh_token = userNeedUpdated.refresh_token;
      }
      const result: UserResponseDef = {
        data: userNeedUpdated || user,
        access_token: getToken(user),
        refresh_token,
      };

      res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return throwError(next, err?.status, err?.message);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const url = await uploadPicture(req);
      return res.status(HttpStatus.OK).json({
        url,
      });
    } catch (err) {
      return throwError(next, err?.status || err?.http_code, err?.message);
    }
  }

  static async loginWithGoogleOrFacebook(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id, first_name, last_name, avatar_url, email, username }: UserDef = req.body;
      const user = await UserModel.findOneAndUpdate(
        {
          platform_id: _id,
        },
        {
          $set: {
            first_name,
            last_name,
            avatar_url,
            email,
            username,
          },
        },
        {
          upsert: true,
        }
      );
      if (user) {
        return res.status(HttpStatus.OK).json({
          data: user,
        });
      }
    } catch (err) {
      return throwError(next, err?.status || err?.http_code, err?.message);
    }
  }

  static async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { access_token, otp } = req.body;
      const data = decodeToken(access_token) as UserDef;
      const user = await UserModel.findById(data._id);
      if (user && user.otp === otp) {
        user.active = true;
        await user.save();
      }
      return res.status(HttpStatus.OK).json({
        message: "Success",
      });
    } catch (err) {
      return throwError(next, err?.status || err?.http_code, err?.message);
    }
  }
}
