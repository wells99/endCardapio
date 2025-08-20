// src/middlewares/multerMiddleware.js
import multer from "multer";
import upload from "../config/multer.js";

export const multerErrorHandler = (req, res, next) => {
  const uploadSingle = upload.single("image");
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};
