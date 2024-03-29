import { Document, Schema, Types, model } from "mongoose";

export enum OrderStatusEnums {
  INCART = "INCART",
  ORDERING = "ORDERING",
  PICKING = "PICKING",
  ORDERED = "ORDERED",
  DELIVERING = "DELIVERING",
  DONE = "DONE",
}

export interface OrderDef {
  user?: Types.ObjectId;
  _id?: Types.ObjectId;
  product: Types.ObjectId;
  model: string;
  phonenumber?: string;
  address?: string;
  promotion_code?: string;
  note?: string;
  status?: OrderStatusEnums;
  amount: number;
}

const OrderSchema = new Schema<OrderDef>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      required: false
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product"
    },
    model: {
      type: String,
      default: ""
    },
    phonenumber: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
    promotion_code: {
      type: String,
      default: ""
    },
    note: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: OrderStatusEnums,
      required: true,
      default: OrderStatusEnums.INCART
    },
    amount: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

export const OrderModel = model<OrderDef>("Order", OrderSchema);

export type OrderDocument = Document<unknown, any, OrderDef> &
  OrderDef & {
    _id: Types.ObjectId;
  };
