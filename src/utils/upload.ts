import { Request } from "express";
import streamifier from "streamifier";
import cloudinary from "cloudinary";

export const uploadPicture = async (req: Request) => {
  return new Promise((resolve, reject) => {
    const base64String = req.body.avatar_url;
    cloudinary.v2.uploader
      .upload("data:image/svg+xml;base64," + base64String)
      .then(data => {
        resolve(data.url);
      })
      .catch(err => {
        reject(err);
      });
  });
};
