import { TIME_EXPIRED_REFRESH_TOKEN_HOURS } from "../constants/auth.constant";
import { HttpStatus } from "../constants/code.constant";
import { HttpException } from "../exception/httpException";
import { encodePassword, comparePassword, getToken } from "../utils/auth";
import { UserDef, UserModel } from "@models/user.model";
import { ERROR_MSG } from "../constants/message.constant";

export class UserService {
  static async register (user: UserDef) {
    const userDb = await UserModel.findOne({
      email: user.email
    });
    if (userDb) {
      throw new HttpException(HttpStatus.CONFLICT, ERROR_MSG.USER_EXISTED);
    }
    const encodePwd = await encodePassword(user.password);
    const userResponse = new UserModel({
      ...user,
      password: encodePwd
    });
    const newUser = await userResponse.save();
    if (!newUser) {
      throw new HttpException(HttpStatus.NOT_FOUND, ERROR_MSG.SERVER_FAIL);
    }
    newUser.refresh_token = getToken(newUser, `${TIME_EXPIRED_REFRESH_TOKEN_HOURS}h`);
    await UserModel.findOneAndUpdate(
      {
        _id: newUser._id
      },
      newUser,
      { upsert: true }
    );
    return newUser;
  }

  static async login (user: Partial<UserDef>) {
    const userDb = await UserModel.findOne({
      phone_number: user.phone_number
    });
    if (!userDb) {
      throw new HttpException(HttpStatus.BAD_REQUEST, ERROR_MSG.USER_NOT_FOUND);
    }
    const isSamePassword = await comparePassword(user.password, userDb.password);
    if (isSamePassword) {
      return userDb;
    }
    throw new HttpException(HttpStatus.BAD_REQUEST, ERROR_MSG.USER_NOT_FOUND);
  }

  static async loginWithAdmin (user: Partial<UserDef>) {
    const userDb = await UserModel.findOne({
      username: user.username
    });
    if (!userDb) {
      throw new HttpException(HttpStatus.BAD_REQUEST, ERROR_MSG.USER_NOT_FOUND);
    }
    const isSamePassword = await comparePassword(user.password, userDb.password);
    if (isSamePassword && userDb.role === 'admin') {
      return userDb;
    }
    throw new HttpException(HttpStatus.BAD_REQUEST, ERROR_MSG.USER_NOT_FOUND);
  }
}
