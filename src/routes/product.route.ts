import { ProductController } from "./../controllers/product.controller";
import { productEndpoints } from "@app/constants/route.constant";
import express from "express";

export const productRoutes = express.Router();

productRoutes.get(productEndpoints.GET_BY_ID, ProductController.getProductById);

productRoutes.get(productEndpoints.GET, ProductController.getProducts);


productRoutes.get(productEndpoints.RECOMMEND, ProductController.getRecommendedProducts);

productRoutes.post(productEndpoints.CREATE, ProductController.createProducts);
