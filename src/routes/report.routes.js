import { authMiddleware } from "../middlewares/authMiddleware.js";
import { Router } from 'express';
import { getDailySummary } from '../controllers/report.controller.js';

const router = Router();

// Rota para obter o resumo das vendas diárias.
// Protegida pelo middleware de autenticação
router.get('/vendas-dia', authMiddleware, getDailySummary);

export default router;