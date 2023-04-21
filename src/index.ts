import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import cloudinary from "cloudinary";
import compression from "compression";

import { connectDB } from "@config/db";

import errorMiddleware from "@app/middleware/error.middleware";

import * as routes from "@app/routes";
import { authEndpoints, orderEndpoints, productEndpoints } from "./constants/route.constant";
import { client } from "./config/redis";
import cors from 'cors'
 
const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors())
app.use(
  express.json({
    limit: "100mb",
  })
);
app.use(
  express.urlencoded({
    limit: "100mb",
    extended: true,
  })
);
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000,
  })
);

// connect database
connectDB();
client.on("error", err => console.log("Redis Client Error", err));

// client
//   .connect()
//   .then(() => {
//     console.log("redis success");
//   })
//   .catch(err => {
//     console.log("err redis", err);
//   });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// config swagger
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerDocument));

// routes
app.use(authEndpoints.AUTH, routes.userRoutes);
app.use(productEndpoints.PRODUCT, routes.productRoutes);
app.use(orderEndpoints.ORDER, routes.orderRoutes);

app.use(errorMiddleware);
app.listen(port, () => {
  console.log("app is listening in port", port);
});
