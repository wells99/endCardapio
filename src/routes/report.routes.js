// src/routes/report.routes.js
import { Router } from 'express';
import reportController from '../controllers/report.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Garanta que a extensão .js seja usada se necessário

const router = Router();

// Rota para obter o resumo das vendas diárias.
// Protegida pelo middleware de autenticação
router.get('/vendas-dia', authMiddleware, reportController.getDailySummary);

export default router;