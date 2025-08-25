import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { multerErrorHandler } from "../middlewares/multerMiddleware.js";
import upload from "../config/multer.js";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";

const router = Router();

// Listar todos os produtos
router.get("/", getProducts);

// Listar um produto específico
router.get("/:id", getProduct);

// ENVIAR IMAGEM COM CAMPO: image --> Criar produto (com upload de imagem, protegido e com tratamento contra arquivos indesejados no lugar das imagens)
router.post("/", authMiddleware, multerErrorHandler, createProduct);

// ENVIAR IMAGEM COM CAMPO: image --> Atualizar produto (com upload de imagem opcional, protegido e com tratamento contra arquivos indesejados no lugar das imagens)
router.put("/:id", authMiddleware, multerErrorHandler, updateProduct);

// Deletar produto (protegido)
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
