import { Document, Schema, Types, model } from "mongoose";

export interface PromotionDef {
  _id?: Types.ObjectId;
  value: number;
  condition: number;
  description: string;
}

const promotionSchema = new Schema<PromotionDef>({
  value: {
    type: Number,
    default: 0,
  },
  condition: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: "",
  },
});

export const UserModel = model<PromotionDef>("Promotion", promotionSchema);

export type CategoryDocument = Document<unknown, any, PromotionDef> &
  PromotionDef & {
    _id: Types.ObjectId;
  };
