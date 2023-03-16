import { HttpStatus } from "@app/constants/code.constant";
import { CategoryModel } from "@app/models/category.model";
import { ProductDocument, ProductModel } from "@app/models/product.model";
import { throwError } from "@app/utils/error";
import { NextFunction, Request, Response } from "express";

interface GetProductsParams {
  page: number;
  limit: number;
  keyword: string;
}

interface GetProduuctsResponse {
  data: ProductDocument;
  page: number;
  limit: number;
  totalPage: number;
}

export class ProductController {
  static async getProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<GetProduuctsResponse>> {
    try {
      const { page = 1, limit = 10, keyword = "" }: GetProductsParams = req.query as any;

      const products = await ProductModel.find({
        name: new RegExp(keyword),
      }).populate({
        path:'category',
        model: CategoryModel
      })
        .skip((page - 1) * limit)
        .limit(limit);
      const total = await ProductModel.countDocuments({
        name: new RegExp(keyword),
      });

      return res.status(HttpStatus.OK).json({
        data: products,
        page,
        limit: Number(limit),
        totalPage: Math.ceil(total / limit),
      });
    } catch (err) {
      return throwError(next, err?.status, err?.message);
    }
  }

  static async createProducts(req: Request, res: Response, next: NextFunction) {
    const { products } = req.body;
    ProductModel.insertMany(products)
      .then(data => {
        res.status(HttpStatus.OK).json(data);
      })
      .catch(err => {
        return throwError(next, err?.status, err?.message);
      });
  }
}
