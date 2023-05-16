import { Document, Schema, Types, model } from "mongoose";

export interface CategoryDef {
  _id?: Types.ObjectId;
  name: string;
}

const categorySchema = new Schema<CategoryDef>({
  name: {
    type: String,
    default: ""
  }
});

export const CategoryModel = model<CategoryDef>("Category", categorySchema);

export type CategoryDocument = Document<unknown, any, CategoryDef> &
  CategoryDef & {
    _id: Types.ObjectId;
  };
