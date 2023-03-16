import { OrderController } from "./../controllers/order.controller";
import { orderEndpoints } from "@app/constants/route.constant";
import { authMiddleware } from "@app/middleware/auth.middleware";
import express from "express";

export const orderRoutes = express.Router();

orderRoutes.get(orderEndpoints.GET, authMiddleware, OrderController.get);

orderRoutes.post(orderEndpoints.CREATE, OrderController.create);

orderRoutes.post(orderEndpoints.PURCHASE, OrderController.purchase);
