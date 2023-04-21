import { OrderController } from "./../controllers/order.controller";
import { orderEndpoints } from "@app/constants/route.constant";
import express from "express";

export const orderRoutes = express.Router();

orderRoutes.get(orderEndpoints.GET, OrderController.get);

orderRoutes.get(orderEndpoints.GET_ALL, OrderController.getAll);

orderRoutes.get(orderEndpoints.GET_STATUS, OrderController.getStatus);

orderRoutes.post(orderEndpoints.UPDATE, OrderController.updateStatus);

orderRoutes.post(orderEndpoints.PURCHASE, OrderController.purchase);
