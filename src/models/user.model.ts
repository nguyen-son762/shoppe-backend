import { Document, Schema, Types, model } from "mongoose";

interface AddressDef {
  name: string;
  phone_number: string;
  city: string;
  street: string;
  default: boolean;
}
export interface UserDef {
  _id?: Types.ObjectId;
  platform_id?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password: string;
  avatar_url?: string;
  phone_number?: string;
  refresh_token?: string;
  address?: AddressDef[];
  active?: boolean;
  otp?: string;
}

const userSchema = new Schema<UserDef>({
  platform_id: {
    type: String,
    required: false,
    default: "",
  },
  username: { type: String, default: "" },
  first_name: {
    type: String,
    default: "",
  },
  last_name: {
    type: String,
    default: "",
  },
  email: { type: String, default: "" },
  password: {
    type: String,
    required: true,
    default: "",
  },
  avatar_url: {
    type: String,
    default: "",
  },
  phone_number: {
    type: String,
    default: "",
  },
  address: [
    {
      name: {
        type: String,
        default: "",
      },
      phone_number: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      street: {
        type: String,
        default: "",
      },
      default: {
        type: Boolean,
        default: true,
      },
    },
  ],
  refresh_token: {
    type: String,
    default: "",
  },
  otp: {
    type: String,
    default: "PENDING",
    expires: "5m",
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export const UserModel = model<UserDef>("User", userSchema);

export type UserDocument = Document<unknown, any, UserDef> &
  UserDef & {
    _id: Types.ObjectId;
  };
