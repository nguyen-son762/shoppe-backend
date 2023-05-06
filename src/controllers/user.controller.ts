import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../constants/code.constant";
import { decodeToken, getToken } from "../utils/auth";
import { throwError } from "../utils/error";
import { UserModel, UserDef, UserDocument } from "@models/user.model";
import { TIME_EXPIRED_REFRESH_TOKEN_HOURS } from "../constants/auth.constant";
import { UserService } from "../services/auth.service";
import { uploadPicture } from "../utils/upload";
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
      const verifyUser = await UserModel.find({ phone_number });
      if (verifyUser) {
        return res.status(HttpStatus.FOUND).json({
          msg: "User is existed",
        });
      }
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

  static async registerByPhonenumber(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone_number, password, first_name, last_name }: UserDef = req.body;
      const otp = otpGenerator.generate(4, {
        specialChars: false,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
      });
      const verifyUser = await UserModel.findOne({ phone_number });
      if (verifyUser) {
        return res.status(HttpStatus.FOUND).json({
          msg: "User is existed",
        });
      }
      const newUser = await UserService.register({
        first_name,
        last_name,
        phone_number,
        password,
        otp,
        active: true,
      });
      const result: UserResponseDef = {
        data: newUser,
        access_token: getToken(newUser),
        refresh_token: newUser.refresh_token,
      };
      // await sendSMS(phone_number, `Your Shopee Fake verification code: ${otp}`);
      res.status(HttpStatus.OK).json(result);
    } catch (err) {
      console.warn("err", err);
      return throwError(next, err?.status, err?.message);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone_number, password }: UserDef = req.body;
      const user = await UserService.login({ phone_number, password });
      if (!user || !user.active) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          msg: "User is not found",
        });
      }
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
          access_token: getToken(user),
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
        return res.status(HttpStatus.OK).json({
          data: user,
          access_token: getToken(user),
        });
      }
      return res.status(HttpStatus.BAD_GATEWAY).json({
        message: "Fail",
      });
    } catch (err) {
      return throwError(next, err?.status || err?.http_code, err?.message);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.body;
      if (user.avatar_url) {
        const url = await uploadPicture(req);
        user.avatar_url = url;
      }
      const userDb = await UserModel.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          $set: {
            ...user,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
      return res.json({
        data: userDb,
      });
    } catch (err) {
      return throwError(next, err?.status || err?.http_code, err?.message);
    }
  }

  static async liked(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, product } = req.body;
      const userDb = await UserModel.findOne({
        _id: user_id,
      });
      const likedProductDb = userDb.liked ? [...userDb.liked] : [];
      const likedProducts = likedProductDb.find(item => item.product.toString() === product)
        ? likedProductDb.filter(item => item.product.toString() !== product)
        : likedProductDb.concat({
            product,
          });
      const user =  await UserModel.findOneAndUpdate(
        {
          _id: user_id,
        },
        {
          liked: likedProducts,
        },
        {
          upsert: true,
          new: true,
        }
      );
      return res.json({
        data: user
      });
    } catch (err) {
      return throwError(next, err?.status || err?.http_code, err?.message);
    }
  }

  static async getTotal(req: Request, res: Response, next: NextFunction) {
    try {
      const total = await UserModel.find().countDocuments();
      return res.json({
        total,
      });
    } catch (err) {
      return throwError(next, err?.status || err?.http_code, err?.message);
    }
  }

  static async getListUser(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = 10;
      const { page = 1 } = req.query;
      const users = await UserModel.find()
        .skip((Number(page) - 1) * limit)
        .limit(limit);
      const total = await UserModel.find().countDocuments();
      return res.status(HttpStatus.OK).json({
        data: users,
        page: Number(page),
        limit: Number(limit),
        totalPage: Math.ceil(total / limit),
        total
      });
    } catch (err) {
      return throwError(next, err?.status || err?.http_code, err?.message);
    }
  }
}
