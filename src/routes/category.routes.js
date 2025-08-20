import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/category.controller.js";

const router = Router();

// Listar todas as categorias
router.get("/", getCategories);

// Listar uma categoria específica
router.get("/:id", getCategory);

// Criar categoria (protegido)
router.post("/", authMiddleware, createCategory);

// Atualizar categoria (protegido)
router.put("/:id", authMiddleware, updateCategory);

// Deletar categoria (protegido)
router.delete("/:id", authMiddleware, deleteCategory);

export default router;
