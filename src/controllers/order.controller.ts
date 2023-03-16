import { HttpStatus } from "@app/constants/code.constant";
import { OrderDef, OrderModel, OrderStatusEnums } from "@app/models/order.model";
import { throwError } from "@app/utils/error";
import { NextFunction, Request, Response } from "express";

type PurchaseProductParams = {
  user_id: string;
  product_id: string;
  model_id: string;
  promotion_code: string | null;
  cart_id: string | null;
};

export class OrderController {
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const orders = await OrderModel.find({
        user: user_id,
      }).populate("product").populate('model');
      if (orders) {
        return res.status(HttpStatus.OK).json({
          data: orders,
        });
      }
      return res.status(HttpStatus.OK).json({
        data: [],
      });
    } catch (err) {
      return throwError(next, err?.status, err?.message);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const orderResponse = new OrderModel({
        ...data,
      });
      await orderResponse.save();
      return res.status(HttpStatus.OK).json({
        is_success: true,
      });
    } catch (err) {
      return throwError(next, err?.status, err?.message);
    }
  }

  static async purchase(req: Request, res: Response, next: NextFunction) {
    try {
      const { data } = req.body;
      const cardIds = (data as PurchaseProductParams[])
        .map(item => item.cart_id)
        .filter(item => item);
      await OrderModel.deleteMany({ _id: cardIds });
      OrderModel.insertMany(
        data.map((item: OrderDef) => ({
          ...item,
          status: OrderStatusEnums.ORDERED,
        }))
      )
        .then(() => {
          return res.status(HttpStatus.OK).json({
            is_success: true,
          });
        })
        .catch(err => {
          return throwError(next, err?.status, err?.message);
        });
    } catch (err) {
      return throwError(next, err?.status, err?.message);
    }
  }
}
