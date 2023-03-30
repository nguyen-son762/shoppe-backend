import { HttpStatus } from "@app/constants/code.constant";
import { CategoryModel } from "@app/models/category.model";
import { ProductDocument, ProductModel } from "@app/models/product.model";
import { throwError } from "@app/utils/error";
import { NextFunction, Request, Response } from "express";

interface GetProductsParams {
  page: number;
  limit: number;
  keyword: string;
  category: string;
  sort?: string;
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
      const {
        page = 1,
        limit = 10,
        keyword = "",
        category,
        sort = "",
      }: GetProductsParams = req.query as any;
      let querySearch = {};
      if (keyword) {
        querySearch = {
          ...querySearch,
          name: new RegExp(keyword.toLowerCase()),
        };
      }
      if (category) {
        querySearch = {
          ...querySearch,
          category,
        };
      }
      let products;
      if (sort) {
        products = await ProductModel.find(querySearch)
          .populate({
            path: "category",
            model: CategoryModel,
          })
          .sort({
            price: sort === "asc" ? 1 : -1,
          })
          .skip((page - 1) * limit)
          .limit(limit);
      } else {
        products = await ProductModel.find(querySearch)
          .populate({
            path: "category",
            model: CategoryModel,
          })
          .skip((page - 1) * limit)
          .limit(limit);
      }
      const total = await ProductModel.countDocuments(querySearch);

      return res.status(HttpStatus.OK).json({
        data: products,
        page: Number(page),
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

  static async getRecommendedProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await ProductModel.find({
        name: {
          $regex: `${req.query.name}`,
          $options: "i",
        },
      });
      return res.json({
        data: products,
      });
    } catch (err) {
      return throwError(next, err?.status, err?.message);
    }
  }
}
