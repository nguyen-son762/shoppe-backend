import { HttpStatus } from "@app/constants/code.constant";
import { ProductModel } from "@app/models/product.model";
import { throwError } from "@app/utils/error";
import { NextFunction, Request, Response } from "express";

interface getProductsParams {
  page: number;
  limit: number;
  keyword: string;
}

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, keyword = "" }: getProductsParams = req.query as any;

      const products = await ProductModel.find({
        name: new RegExp(keyword),
      })
        .skip((page - 1) * limit)
        .limit(limit);
      const total = await ProductModel.countDocuments({
        name: new RegExp(keyword),
      });

      return res.status(HttpStatus.OK).json({
        data: products,
        page,
        limit,
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
