import { ProductController } from "./../controllers/product.controller";
import { productEndpoints } from "@app/constants/route.constant";
import express from "express";

export const productRoutes = express.Router();

productRoutes.get(productEndpoints.GET, ProductController.getProducts);

productRoutes.post(productEndpoints.CREATE, ProductController.createProducts);
