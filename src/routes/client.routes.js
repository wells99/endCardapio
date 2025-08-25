import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} from "../controllers/cliente.controller.js";

const router = Router();

// Listar todas as categorias
router.get("/",authMiddleware, getClients);

// Listar uma categoria específica
router.get("/:id",authMiddleware, getClient);

// Criar categoria (protegido)
router.post("/", authMiddleware, createClient);

// Atualizar categoria (protegido)
router.put("/:id", authMiddleware, updateClient);

// Deletar categoria (protegido)
router.delete("/:id", authMiddleware, deleteClient);

export default router;
