import { Request } from "express";
import streamifier from "streamifier";
import cloudinary from "cloudinary";

export const uploadPicture = async (req: Request) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result.url);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};
