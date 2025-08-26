import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
} from "../controllers/orders.controller.js";


const router = Router();

// Rota para criar um novo item de opção de produto
router.post("/", authMiddleware, createOrder);

// Rota para listar todos os itens de opção de produto
router.get("/", getOrders);

// Rota para obter um item de opção de produto específico por ID
router.get("/:id", getOrder);

// Rota para atualizar um item de opção de produto
router.put("/:id", authMiddleware, updateOrder);

// Rota para deletar um item de opção de produto
router.delete("/:id", authMiddleware, deleteOrder);

export default router;
