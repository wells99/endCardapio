import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany
} from "../controllers/company.controller.js";

const router = Router();

// Listar todas as Empresas
router.get("/",authMiddleware, getCompanies);

// Listar uma Empresa específica
router.get("/:id",authMiddleware, getCompany);

// Criar Empresa (protegido)
router.post("/", authMiddleware, createCompany);

// Atualizar Empresa (protegido)
router.put("/:id", authMiddleware, updateCompany);

// Deletar Empresa (protegido)
router.delete("/:id", authMiddleware, deleteCompany);

export default router;
