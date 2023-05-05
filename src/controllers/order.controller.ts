import { HttpStatus } from "../constants/code.constant";
import { CategoryModel } from "../models/category.model";
import { OrderDef, OrderModel, OrderStatusEnums } from "../models/order.model";
import { throwError } from "../utils/error";
import { NextFunction, Request, Response } from "express";

type PurchaseProductParams = OrderDef & {
  cart_id: string;
};

export class OrderController {
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, page } = req.params;
      const status = req.query.status;
      let query = {};
      if(user_id){
        query = {
          user: user_id,
        }
      }
      if (status) {
        query = {
          ...query,
          status,
        };
      }
      const orders = await OrderModel.find(query).populate({
        path: "product",
        populate: {
          path: "category",
        },
      });
      const total  = await OrderModel.find(query).countDocuments()
      if (orders) {
        return res.status(HttpStatus.OK).json({
          data: orders,
          total,
          page: Number(page),
          limit: Number(10),
          totalPage: Math.ceil(total / 10),
        });
      }
      return res.status(HttpStatus.OK).json({
        data: [],
      });
    } catch (err) {
      return throwError(next, err?.status, err?.message);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      let result = {};
      const { page = 1, status,from,to } = req.query;
      let query = {
        createdAt: {
          $gte: new Date(from as string),
          $lt: new Date(to as string),
        },
      } as any;
      if (status) {
        query = {
          ...query,
          status,
        };
      }
      const orders = await OrderModel.find(query)
        .skip((Number(page) - 1) * 10)
        .limit(20)
        .populate([{
          path: "product",
          populate: {
            path: "category",
          },
        },{
          path: "user",
        }]);
      const total = await OrderModel.countDocuments(query);
      if (orders) {
        return res.status(HttpStatus.OK).json({
          data: orders,
          total,
          totalPage: Math.ceil(total / 10),
          page: Number(page),
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
      const { user, product, model, amount } = req.body;
      const cartOfUser = await OrderModel.findOne({
        user,
        model,
      });
      if (cartOfUser) {
        await cartOfUser.update(
          {
            amount: cartOfUser.amount + amount,
          },
          { upsert: true }
        );
        return res.status(HttpStatus.OK).json({
          is_success: true,
        });
      }
      const orderResponse = new OrderModel({
        user,
        product,
        model,
        amount: Number(amount),
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
          status: OrderStatusEnums.ORDERING,
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

  static async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const orders = await OrderModel.find({
        user: user_id,
      });
      const status = {
        ORDERED: 0,
        ORDERING: 0,
        PICKING: 0,
      };
      orders.map(order => {
        status[order.status] += 1;
      });
      return res.status(HttpStatus.OK).json({
        status,
      });
    } catch (err) {
      return throwError(next, err?.status, err?.message);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const { status, order_id } = req.body;
      const data = await OrderModel.findOneAndUpdate(
        {
          user: user_id,
          _id: order_id,
        },
        {
          $set: {
            status,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
      return res.status(HttpStatus.OK).json({
        data: data,
      });
    } catch (err) {
      return throwError(next, err?.status, err?.message);
    }
  }
}
