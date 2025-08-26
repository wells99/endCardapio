import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createProductOption,
  getProductOptions,
  getProductOptionById,
  updateProductOption,
  deleteProductOption,
} from "../controllers/productOption.controller.js";


const router = Router();

// Rota para criar uma nova opção de produto
router.post("/", authMiddleware, createProductOption);

// Rota para listar todas as opções de produto
router.get("/", getProductOptions);

// Rota para obter uma opção de produto específica por ID
router.get("/:id", getProductOptionById);

// Rota para atualizar uma opção de produto
router.put("/:id", authMiddleware, updateProductOption);

// Rota para deletar uma opção de produto
router.delete("/:id", authMiddleware, deleteProductOption);

export default router;