import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
    getPayments,
    getPayment,
    createPayment,
    updatePayment,
    deletePayment,
} from "../controllers/payment.controller.js";


const router = Router();

// Rota para criar um novo pagamento
router.post("/", authMiddleware, createPayment);

// Listar todos os pagamentos
router.get("/",authMiddleware, getPayments);

// Obter um pagamento específico por ID
router.get("/:id",authMiddleware, getPayment);

// Atualizar um pagamento
router.put("/:id", authMiddleware, updatePayment);

// Deletar um pagamento
router.delete("/:id", authMiddleware, deletePayment);

export default router;
