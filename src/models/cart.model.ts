import { Document, Schema, Types, model } from "mongoose";

export enum CartStatusEnums {
  INCART = "INCART",
  ORDERING = "ORDERING",
  PICKING = "PICKING",
  ORDERED = "ORDERED",
  DELIVERING = "DELIVERING",
  DONE = "DONE",
}

export interface CartDef {
  _id?: Types.ObjectId;
  product_id: Types.ObjectId;
  model_id: Types.ObjectId;
  promotion_id: Types.ObjectId;
  status: CartStatusEnums;
}

const CartSchema = new Schema<CartDef>({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  model_id: {
    type: Schema.Types.ObjectId,
    ref: "Model",
  },
  promotion_id: {
    type: Schema.Types.ObjectId,
    ref: "Promotion",
  },
  status: { type: String, enum: CartStatusEnums },
});

export const CartModel = model<CartDef>("Cart", CartSchema);

export type CategoryDocument = Document<unknown, any, CartDef> &
  CartDef & {
    _id: Types.ObjectId;
  };
