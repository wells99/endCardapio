import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getProductOptionItems,
  getProductOptionItem,
  createProductOptionItem, 
  updateProductOptionItem,
  deleteProductOptionItem,
} from "../controllers/productOptionItem.controller.js";


const router = Router();

// Rota para criar um novo item de opção de produto
router.post("/", authMiddleware, createProductOptionItem);

// Rota para listar todos os itens de opção de produto
router.get("/",authMiddleware, getProductOptionItems);

// Rota para obter um item de opção de produto específico por ID
router.get("/:id",authMiddleware, getProductOptionItem);

// Rota para atualizar um item de opção de produto
router.put("/:id", authMiddleware, updateProductOptionItem);

// Rota para deletar um item de opção de produto
router.delete("/:id", authMiddleware, deleteProductOptionItem);

export default router;
